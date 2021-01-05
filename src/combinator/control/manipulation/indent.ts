import { undefined } from 'spica/global';
import { Parser, eval, exec } from '../../data/parser';
import { some } from '../../data/parser/some';
import { line, firstline } from '../constraint/line';
import { bind } from '../monad/bind';
import { match } from './match';
import { open } from './surround';
import { memoize } from 'spica/memoize';
import { join } from 'spica/array';

export function indent<P extends Parser<unknown>>(parser: P): P;
export function indent<T, D extends Parser<unknown>[]>(parser: Parser<T, D>): Parser<T, D> {
  assert(parser);
  return bind(match(
    /^(?=(([^\S\n])\2*))/,
    memoize(
    ([, indent]) =>
      some(line(open(indent, source => [[firstline(source, false)], '']))),
    ([, indent]) => indent)),
    (rs, rest, context) => {
      const result = parser(join(rs, '\n'), context);
      return result && exec(result) === ''
        ? [eval(result), rest]
        : undefined;
    });
}
