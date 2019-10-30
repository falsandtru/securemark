import { Parser } from '../../data/parser';
import { convert } from './convert';

export function trim<P extends Parser<unknown, any, object>>(parser: P): P;
export function trim<T, S extends Parser<unknown, any, object>[]>(parser: Parser<T, S, object>): Parser<T, S, object> {
  return convert(source => source.trim(), parser);
}

export function trimStart<P extends Parser<unknown, any, object>>(parser: P): P;
export function trimStart<T, S extends Parser<unknown, any, object>[]>(parser: Parser<T, S, object>): Parser<T, S, object> {
  return convert(
    source =>
      source.slice(source.lastIndexOf(source.trim())),
    parser);
}

export function trimEnd<P extends Parser<unknown, any, object>>(parser: P): P;
export function trimEnd<T, S extends Parser<unknown, any, object>[]>(parser: Parser<T, S, object>): Parser<T, S, object> {
  return convert(
    (source, str?: string) =>
      source.slice(0, source.lastIndexOf(str = source.trim()) + str.length),
    parser);
}
