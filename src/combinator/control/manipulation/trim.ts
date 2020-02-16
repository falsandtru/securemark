import { Parser } from '../../data/parser';
import { convert } from './convert';

export function trim<P extends Parser<unknown>>(parser: P): P;
export function trim<T, D extends Parser<unknown>[]>(parser: Parser<T, D>): Parser<T, D> {
  return convert(source => source.trim(), parser);
}
