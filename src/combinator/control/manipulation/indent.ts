import { Parser, eval, exec } from '../../data/parser';
import { some } from '../../data/parser/some';
import { line, firstline } from '../constraint/line';
import { rewrite } from '../constraint/scope';
import { bind } from '../monad/bind';
import { match } from './match';
import { surround } from './surround';

export function indent<P extends Parser<unknown, any, object>>(parser: P): P;
export function indent<T, S extends Parser<unknown, any, object>[]>(parser: Parser<T, S, object>): Parser<T, S, object> {
  assert(parser);
  return bind<string, T, S, object>(match(
    /^(?=([^\S\n]+))/,
    ([, indent]) =>
      some(line(rewrite(
        (s, c) => [[], s.slice(firstline(s).length), c],
        surround(indent, (s, c) => [[firstline(s, false)], '', c], ''))))),
    (rs, rest, config) => {
      const result = parser(rs.join('\n'), config);
      return result && exec(result) === ''
        ? [eval(result), rest, config]
        : undefined;
    });
}
