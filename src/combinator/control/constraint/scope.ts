import { Parser, eval, exec, check } from '../../data/parser';

export function focus<P extends Parser<unknown>>(scope: string | RegExp, parser: P): P;
export function focus<T, D extends Parser<unknown>[]>(scope: string | RegExp, parser: Parser<T, D>): Parser<T, D> {
  assert(scope instanceof RegExp ? !scope.global && scope.source.startsWith('^') : true);
  assert(parser);
  return (source, state, config) => {
    if (source === '') return;
    const [src = ''] = typeof scope === 'string'
      ? source.startsWith(scope) ? [scope] : []
      : source.match(scope) || [];
    assert(source.startsWith(src));
    if (src === '') return;
    const result = parser(src, state, config);
    assert(check(src, result));
    if (!result) return;
    assert(exec(result)==='');
    return exec(result).length < src.length
      ? [eval(result), exec(result) + source.slice(src.length), state]
      : undefined;
  };
}

export function rewrite<P extends Parser<unknown>>(scope: Parser<unknown>, parser: P): P;
export function rewrite<T, D extends Parser<unknown>[]>(scope: Parser<never>, parser: Parser<T, D>): Parser<T, D> {
  assert(scope);
  assert(parser);
  return (source, state, config) => {
    if (source === '') return;
    const res1 = scope(source, state, config);
    assert(check(source, res1));
    if (!res1 || exec(res1).length >= source.length) return;
    const src = source.slice(0, source.length - exec(res1).length);
    assert(src !== '');
    assert(source.startsWith(src));
    const res2 = parser(src, state, config);
    assert(check(src, res2));
    if (!res2) return;
    assert(exec(res2) === '');
    return exec(res2).length < src.length
      ? [eval(res2), exec(res2) + exec(res1), state]
      : undefined;
  };
}
