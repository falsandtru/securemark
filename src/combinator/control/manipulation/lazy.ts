import { Parser } from '../../data/parser';

export function lazy<P extends Parser<unknown>>(builder: () => P): P;
export function lazy<N>(builder: () => Parser<N>): Parser<N> {
  let parser: Parser<N>;
  return input =>
    parser !== undefined
      ? parser(input)
      : (parser = builder())(input);
}
