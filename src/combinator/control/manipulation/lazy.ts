import { Parser } from '../../data/parser';

export function lazy<P extends Parser<unknown>>(builder: () => P): P;
export function lazy<T>(builder: () => Parser<T>): Parser<T> {
  let parser: Parser<T>;
  return input =>
    parser !== undefined
      ? parser(input)
      : (parser = builder())(input);
}
