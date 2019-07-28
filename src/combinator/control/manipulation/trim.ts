import { Parser } from '../../data/parser';
import { convert } from './convert';

export function trim<P extends Parser<unknown, any>>(parser: P): P;
export function trim<T, S extends Parser<unknown, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return convert(source => source.trim(), parser);
}

export function trimStart<P extends Parser<unknown, any>>(parser: P): P;
export function trimStart<T, S extends Parser<unknown, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return convert(
    source =>
      source.slice(source.lastIndexOf(source.trim())),
    parser);
}

export function trimEnd<P extends Parser<unknown, any>>(parser: P): P;
export function trimEnd<T, S extends Parser<unknown, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return convert(
    (source, str?: string) =>
      source.slice(0, source.lastIndexOf(str = source.trim()) + str.length),
    parser);
}
