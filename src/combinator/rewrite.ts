import { Parser } from './parser';

export function rewrite<P extends Parser<any, any>>(a: Parser<any, any>, b: P): P;
export function rewrite<S extends Parser<any, any>[], T>(a: Parser<never, any>, b: Parser<T, S>): Parser<T, S> {
  return source => {
    const ar = a(source);
    if (!ar) return;
    const br = b(source.slice(0, source.length - ar[1].length));
    if (!br) return;
    return [br[0], br[1] + ar[1]];
  };
}
