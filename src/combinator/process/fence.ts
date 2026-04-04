import { Parser, SubParsers, Input, List, Node } from '../parser';
import { spend } from '../effect/clock';
import { firstline, isEmptyline } from './line';

export function fence<I extends Input, S extends SubParsers<never, I>>(opener: RegExp, write: boolean, separation = true): Parser<string, I, S> {
  assert(!opener.flags.match(/[gm]/) && opener.sticky && !opener.source.startsWith('^'));
  return (input, output) => {
    const { source } = input;
    if (input.position === source.length) return;
    opener.lastIndex = input.position;
    const matches = opener.exec(source);
    if (!matches) return;
    assert(matches[0] === firstline(source, input.position));
    spend(input, output, matches[0].length);
    const delim = matches[1];
    assert(delim && delim === delim.trim());
    if (matches[0].includes(delim, delim.length)) return;
    input.position += matches[0].length;
    // Prevent annoying parsing in editing.
    const secondline = firstline(source, input.position);
    if (isEmptyline(secondline, 0) &&
        firstline(source, input.position + secondline.length).trimEnd() !== delim) {
      input.position -= matches[0].length;
      return;
    }
    const { position } = input;
    let body = '';
    let closer = '';
    assert(matches[0].endsWith('\n'));
    for (input.position -= 1; ;) {
      input.position = source.indexOf(`\n${delim}`, input.position) + 1 || source.length;
      if (!isEmptyline(source, input.position + delim.length)) continue;
      body = source.slice(position, input.position);
      closer = firstline(source, input.position);
      input.position += closer.length;
      break;
    }
    if (separation) for (; !isEmptyline(source, input.position);) {
      input.position = source.indexOf('\n', input.position) + 1 || source.length;
    }
    if (write) {
      const overflow = source.slice(position + body.length + closer.length, input.position);
      output.push(
        new List([body, overflow, closer].map(str => new Node(str)))
          .import(new List(matches.map(str => new Node(str)))));
    }
    return output.context;
  };
}
