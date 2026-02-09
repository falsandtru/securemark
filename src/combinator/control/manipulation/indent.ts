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
export function indent<N>(opener: RegExp | Parser<N>, parser?: Parser<N> | boolean, separation = false): Parser<N> {
  if (typeof opener === 'function') return indent(/^([ \t])\1*/, opener, parser as boolean);
  assert(parser);
  return bind(block(match(
    opener,
    memoize(
    ([indent]) =>
      some(line(open(indent, ({ source }) => [[source], '']))),
    ([indent]) => indent.length * 2 + +(indent[0] === ' '), {}), false), separation),
    (lines, rest, context) => {
      assert(parser = parser as Parser<N>);
      // 影響する使用はないはず
      //const { backtracks } = context;
      //context.backtracks = {};
      const result = parser({ source: trimBlockEnd(lines.join('')), context });
      //context.backtracks = backtracks;
      assert(result);
      return result && exec(result) === ''
        ? [eval(result), rest]
        : undefined;
    });
}

function trimBlockEnd(block: string): string {
  return block === ''
      || block.at(-1) !== '\n'
    ? block
    : block.slice(0, -1);
}
