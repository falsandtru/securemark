import { Parser } from '../../data/parser';

export function lazy<P extends Parser<unknown>>(builder: () => P): P;
export function lazy<T>(builder: () => Parser<T>): Parser<T> {
  let parser: Parser<T> | undefined;
  return (source, context) => {
    parser ? parser : parser = builder();
    return parser(source, context);
  };
}
