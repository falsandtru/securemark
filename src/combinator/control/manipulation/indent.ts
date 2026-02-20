import { Parser, subinput, eval, failsafe } from '../../data/parser';
import { some } from '../../data/parser/some';
import { block } from '../constraint/block';
import { line } from '../constraint/line';
import { bind } from '../monad/bind';
import { match } from './match';
import { open } from './surround';
import { memoize } from 'spica/memoize';

export function indent<P extends Parser<unknown>>(parser: P, separation?: boolean): P;
export function indent<P extends Parser<unknown>>(opener: RegExp, parser: P, separation?: boolean): P;
export function indent<N>(opener: RegExp | Parser<N>, parser: Parser<N> | boolean = false, separation = false): Parser<N> {
  if (typeof opener === 'function') {
    separation = parser as boolean;
    parser = opener;
    opener = /([ \t])\1*/y;
  }
  assert(!opener.flags.match(/[gm]/) && opener.sticky && !opener.source.startsWith('^'));
  assert(parser);
  return failsafe(bind(block(match(
    opener,
    memoize(
    ([indent]) =>
      some(line(open(indent, ({ context }) => {
        const { source, position } = context;
        context.position = source.length;
        return [[source.slice(position)]];
      }))),
    ([indent]) => indent.length * 2 + +(indent[0] === ' '), {})), separation),
    (lines, context) => {
      assert(parser = parser as Parser<N>);
      const result = parser(subinput(trimBlockEnd(lines.join('')), context));
      assert(result);
      return result
        ? [eval(result)]
        : undefined;
    }));
}

function trimBlockEnd(block: string): string {
  return block === ''
      || block.at(-1) !== '\n'
    ? block
    : block.slice(0, -1);
}
