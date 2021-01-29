import { Parser } from '../../data/parser';
import { convert } from './convert';

export function trim<P extends Parser<unknown>>(parser: P): P;
export function trim<T>(parser: Parser<T>): Parser<T> {
  return convert(source => source.trim(), parser);
}
