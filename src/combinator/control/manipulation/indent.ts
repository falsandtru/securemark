import { Parser, eval, exec } from '../../data/parser';
import { some } from '../../data/parser/some';
import { line, firstline } from '../constraint/line';
import { rewrite } from '../constraint/scope';
import { bind } from '../monad/bind';
import { match, memoize } from './match';
import { surround } from './surround';

export function indent<P extends Parser<unknown>>(parser: P): P;
export function indent<T>(parser: Parser<T>): Parser<T> {
  assert(parser);
  return bind(match(
    /^(?=(([^\S\n])\2*))/,
    memoize(([, indent]) => indent,
    indent =>
      some(line(rewrite(
        source => [[], source.slice(firstline(source).length)],
        surround(indent, source => [[firstline(source, false)], ''], '')))))),
    (rs, rest, config) => {
      const result = parser(rs.join('\n'), config);
      return result && exec(result) === ''
        ? [eval(result), rest]
        : undefined;
    });
}
