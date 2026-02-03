import { Parser } from '../../data/parser';
import { convert } from './convert';

export function trim<P extends Parser<unknown>>(parser: P): P;
export function trim<T>(parser: Parser<T>): Parser<T> {
  return convert(source => source.trim(), parser, false);
}

export function trimStart<P extends Parser<unknown>>(parser: P): P;
export function trimStart<T>(parser: Parser<T>): Parser<T> {
  return convert(source => source.trimStart(), parser, true);
}

export function trimEnd<P extends Parser<unknown>>(parser: P): P;
export function trimEnd<T>(parser: Parser<T>): Parser<T> {
  return convert(source => source.trimEnd(), parser, false);
}
