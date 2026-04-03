import { Parser, SubParsers } from '../parser';

export function then<P extends Parser>(success: P, failure: P): P;
export function then<T>(success: Parser<T>, failure: Parser<T>): Parser<T> {
  assert(success);
  assert(failure);
  return (input, output) => output.state ? success(input, output) : failure(input, output);
}

export function success<P extends Parser>(parser: P): P;
export function success<T>(parser: Parser<T>): Parser<T> {
  assert(parser);
  return (input, output) => output.context && parser(input, output);
}

export function failure<P extends Parser>(parser: P): P;
export function failure<T>(parser: Parser<T>): Parser<T> {
  assert(parser);
  return (input, output) => output.context ?? parser(input, output);
}

export function always<P extends Parser>(parsers: readonly P[]): P;
export function always<T, S extends SubParsers<T>>(parsers: S): Parser<T> {
  return () => parsers;
}

export function force<P extends Parser>(parser: P): P;
export function force<T>(parser: Parser<T>): Parser<T> {
  return (input, output) =>
    input.position === input.source.length
      ? output.context
      : parser(input, output);
}
