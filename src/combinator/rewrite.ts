import { Parser } from './parser';

export function rewrite<P extends Parser<any, any>>(a: Parser<any, any>, b: P): P;
export function rewrite<T, S extends Parser<any, any>[]>(a: Parser<never, any>, b: Parser<T, S>): Parser<T, S> {
  return source => {
    const ar = a(source);
    if (!ar) return;
    const br = b(source.slice(0, source.length - ar[1].length));
    if (!br) return;
    assert(source.slice(1).endsWith(br[1] + ar[1]));
    return br[1].length + ar[1].length < source.length
      ? [br[0], br[1] + ar[1]]
      : undefined;
  };
}
