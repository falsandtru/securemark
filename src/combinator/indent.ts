import { Parser, eval, exec } from './parser';
import { some } from './some';
import { bind } from './bind';
import { match } from './match';
import { surround } from './surround';
import { line, firstline } from './line';
import { rewrite } from './scope';

export function indent<P extends Parser<any, any>>(parser: P): P;
export function indent<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  assert(parser);
  return bind<string, T, S>(match(
    /^(?=(\s+))/,
    ([, indent], source) =>
      some(line(rewrite(
        s => [[], s.slice(firstline(s).length)],
        surround(indent, s => [[s.split('\n', 1)[0]], ''], ''))))
      (source)),
    (rs, rest) => {
      const result = parser(rs.join('\n'));
      return result && exec(result) === ''
        ? [eval(result), rest]
        : undefined;
    });
}
