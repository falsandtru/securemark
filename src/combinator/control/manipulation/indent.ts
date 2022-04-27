import { undefined } from 'spica/global';
import { Parser, eval, exec } from '../../data/parser';
import { some } from '../../data/parser/some';
import { block } from '../constraint/block';
import { line } from '../constraint/line';
import { bind } from '../monad/bind';
import { match } from './match';
import { open } from './surround';
import { memoize } from 'spica/memoize';
import { join } from 'spica/array';

export function indent<P extends Parser<unknown>>(parser: P, separation?: boolean): P;
export function indent<T>(parser: Parser<T>, separation = false): Parser<T> {
  assert(parser);
  return bind(block(match(
    /^(?=(([ \t])\2*))/,
    memoize(
    ([, indent]) =>
      some(line(open(indent, source => [[unline(source)], '']))),
    ([, indent]) => indent.length * 2 + +(indent[0] === ' '), [])), separation),
    (nodes, rest, context) => {
      const result = parser(join(nodes, '\n'), context);
      return result && exec(result) === ''
        ? [eval(result), rest]
        : undefined;
    });
}

function unline(line: string): string {
  return line === ''
      || line[line.length - 1] !== '\n'
    ? line
    : line.slice(0, -1);
}
