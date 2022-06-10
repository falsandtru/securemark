import { undefined } from 'spica/global';
import { Parser, eval, exec } from '../../data/parser';
import { some } from '../../data/parser/some';
import { block } from '../constraint/block';
import { line } from '../constraint/line';
import { bind } from '../monad/bind';
import { match } from './match';
import { open } from './surround';
import { memoize } from 'spica/memoize';

export function indent<P extends Parser<unknown>>(parser: P, separation?: boolean): P;
export function indent<P extends Parser<unknown>>(opener: RegExp, parser: P, separation?: boolean): P;
export function indent<T>(opener: RegExp | Parser<T>, parser?: Parser<T> | boolean, separation = false): Parser<T> {
  if (typeof opener === 'function') return indent(/^([ \t])\1*/, opener, parser as boolean);
  assert(parser);
  return bind(block(match(
    opener,
    memoize(
    ([indent]) =>
      some(line(open(indent, source => [[source], '']))),
    ([indent]) => indent.length * 2 + +(indent[0] === ' '), [])), separation),
    (lines, rest, context) => {
      assert(parser = parser as Parser<T>);
      const result = parser(trimBlockEnd(lines.join('')), context);
      return result && exec(result) === ''
        ? [eval(result), rest]
        : undefined;
    });
}

function trimBlockEnd(block: string): string {
  return block === ''
      || block[block.length - 1] !== '\n'
    ? block
    : block.slice(0, -1);
}
