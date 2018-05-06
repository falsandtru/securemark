import { Parser } from './parser';
import { some } from './some';
import { capture } from './capture';
import { surround } from './surround';
import { line } from '../parser/source/line';
import { bind } from './bind';

export function indent<P extends Parser<any, any>>(parser: P): P;
export function indent<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  assert(parser);
  return bind<string, T, S>(
    capture(
      /^\s+/,
      ([whole], rest) =>
        some(line(surround(whole, s => [[s.split('\n')[0]], ''], ''), true, true))(whole + rest)),
    (rs, rest) => {
      const result = parser(rs.join('\n'));
      return result && result[1] === ''
        ? [result[0], rest]
        : undefined;
    });
}
