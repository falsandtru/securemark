import { Parser, eval, exec } from './parser';

export function rewrite<P extends Parser<any, any>>(a: Parser<any, any>, b: P): P;
export function rewrite<T, S extends Parser<any, any>[]>(a: Parser<never, any>, b: Parser<T, S>): Parser<T, S> {
  assert(a);
  assert(b);
  return source => {
    if (source === '') return;
    const ar = a(source);
    if (!ar || exec(ar).length >= source.length) return;
    const br = b(source.slice(0, source.length - exec(ar).length));
    if (!br || exec(br).length >= source.length) return;
    assert(exec(br)==='');
    assert(source.slice(1).endsWith(exec(br) + exec(ar)));
    return exec(br).length + exec(ar).length < source.length
      ? [eval(br), exec(br) + exec(ar)]
      : undefined;
  };
}
