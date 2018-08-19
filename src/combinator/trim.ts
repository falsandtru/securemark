import { Parser } from './parser';
import { convert } from './convert';

export function trim<P extends Parser<any, any>>(parser: P): P;
export function trim<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return convert(source => source.trim(), parser);
}
