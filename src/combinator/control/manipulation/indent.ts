import { Parser, eval, exec } from '../../data/parser';
import { some } from '../../data/parser/some';
import { line, firstline } from '../constraint/line';
import { rewrite } from '../constraint/scope';
import { bind } from '../monad/bind';
import { match, memoize } from './match';
import { surround } from './surround';

export function indent<P extends Parser<unknown, any, object>>(parser: P): P;
export function indent<T, S extends Parser<unknown, any, object>[]>(parser: Parser<T, S, object>): Parser<T, S, object> {
  assert(parser);
  return bind<string, T, S, object>(match(
    /^(?=([^\S\n]+))/,
    memoize(([, indent]) => indent,
    indent =>
      some(line(rewrite(
        (source, config) => [[], source.slice(firstline(source).length), config],
        surround(indent, (source, config) => [[firstline(source, false)], '', config], '')))))),
    (rs, rest, config) => {
      const result = parser(rs.join('\n'), config);
      return result && exec(result) === ''
        ? [eval(result), rest, config]
        : undefined;
    });
}
