import { Parser, SubParsers, Input, List, Node } from '../parser';
import { spend } from '../effect/clock';
import { firstline, isEmptyline } from './line';

export function fence<I extends Input, S extends SubParsers<never, I>>(opener: RegExp, write: boolean, separation = true): Parser<string, I, S> {
  assert(!opener.flags.match(/[gm]/) && opener.sticky && !opener.source.startsWith('^'));
  return (input, output) => {
    const { source, position } = input;
    if (position === source.length) return;
    opener.lastIndex = position;
    const matches = opener.exec(source);
    if (!matches) return;
    assert(matches[0] === firstline(source, position));
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
    let body = '';
    let closer = '';
    let overflow = '';
    for (let count = 1; ; ++count) {
      if (input.position === source.length) break;
      const line = firstline(source, input.position);
      if (closer && isEmptyline(line, 0)) break;
      if(closer) {
        overflow += line;
      }
      if (!closer && line.startsWith(delim) && line.trimEnd() === delim) {
        closer = line;
        if (isEmptyline(source, input.position + line.length)) {
          input.position += line.length;
          break;
        }
        if (!separation) {
          input.position += line.length;
          break;
        }
        assert(!overflow);
        overflow = line;
      }
      if (!overflow) {
        body += line;
      }
      input.position += line.length;
    }
    write && output.push(
      new List([body, overflow, closer].map(str => new Node(str)))
        .import(new List(matches.map(str => new Node(str)))));
    return output.context;
  };
}
