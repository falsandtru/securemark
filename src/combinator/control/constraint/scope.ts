import { Parser, eval, exec, validate } from '../../data/parser';

export function focus<P extends Parser<any, any>>(scope: RegExp, parser: P): P;
export function focus<T, S extends Parser<any, any>[]>(scope: RegExp, parser: Parser<T, S>): Parser<T, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    const [src = ''] = source.match(scope) || [];
    assert(source.startsWith(src));
    if (src === '') return;
    const result = parser(src);
    assert(validate(src, result));
    if (!result) return;
    assert(exec(result)==='');
    return exec(result).length < src.length
      ? [eval(result), exec(result) + source.slice(src.length)]
      : undefined;
  };
}

export function rewrite<P extends Parser<any, any>>(scope: Parser<any, any>, parser: P): P;
export function rewrite<T, S extends Parser<any, any>[]>(scope: Parser<never, any>, parser: Parser<T, S>): Parser<T, S> {
  assert(scope);
  assert(parser);
  return source => {
    if (source === '') return;
    const res1 = scope(source);
    assert(validate(source, res1));
    if (!res1 || exec(res1).length >= source.length) return;
    const src = source.slice(0, source.length - exec(res1).length);
    assert(src !== '');
    assert(source.startsWith(src));
    const res2 = parser(src);
    assert(validate(src, res2));
    if (!res2) return;
    //assert(exec(res2) === '');
    return exec(res2).length < src.length
      ? [eval(res2), exec(res2) + exec(res1)]
      : undefined;
  };
}
