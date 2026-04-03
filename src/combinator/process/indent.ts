import { Parser, Result, Node } from '../parser';
import { some } from '../control/some';
import { always } from '../control/state';
import { block } from './block';
import { line } from './line';
import { match } from './match';
import { open } from './surround';
import { memoize } from 'spica/memoize';

export function indent<P extends Parser>(parser: P, separation?: boolean): P;
export function indent<P extends Parser>(opener: RegExp, parser: P, separation?: boolean): P;
export function indent(opener: RegExp | Parser<string>, parser: Parser<string> | boolean = false, separation = false): Parser<string> {
  if (typeof opener === 'function') {
    separation = parser as boolean;
    parser = opener;
    opener = / {1,4}|\t{1,2}/y;
  }
  assert(!opener.flags.match(/[gm]/) && opener.sticky && !opener.source.startsWith('^'));
  assert(parser = parser as Parser<string>);
  return always([
    (input, output) => {
      if (input.position === input.source.length) return Result.skip;
      output.push();
      return output.context;
    },
    block(match(opener, memoize(
      ([indent]) =>
        some(open(indent, line(({ source }, output) =>
          output.append(new Node(source))))),
      ([indent]) => indent.length * 2 + -(indent[0] === ' '), [], 2 ** 4 - 1)),
      separation),
    (input, output) => {
      const source = trimBlockEnd(output.pop().foldl((acc, node) => acc + node.value, ''));
      if (source === '') return Result.skip;
      input.scope.focus(source);
      return output.context;
    },
    parser,
    (input, output) => {
      input.scope.unfocus();
      return output.context;
    },
  ]);
}

function trimBlockEnd(block: string): string {
  return block === ''
      || block.at(-1) !== '\n'
    ? block
    : block.slice(0, block.at(-2) === '\r' ? -2 : -1);
}
