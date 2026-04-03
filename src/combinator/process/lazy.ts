import { Parser } from '../parser';

export function lazy<P extends Parser>(builder: () => P): P;
export function lazy<T>(builder: () => Parser<T>): Parser<T> {
  let parser: Parser<T> = (input, output) =>
    (parser = builder())(input, output);
  return (input, output) => parser(input, output);
}
