import { undefined } from 'spica/global';
import { Parser, Context, eval, exec, check } from '../../data/parser';

export function focus<P extends Parser<unknown>>(scope: string | RegExp, parser: P): P;
export function focus<T>(scope: string | RegExp, parser: Parser<T>): Parser<T> {
  assert(scope instanceof RegExp ? !scope.flags.match(/[gmy]/) && scope.source.startsWith('^') : scope);
  assert(parser);
  const match: (source: string) => string = typeof scope === 'string'
    ? source => source.slice(0, scope.length) === scope ? scope : ''
    : source => source.match(scope)?.[0] ?? '';
  return (source, context = {}) => {
    if (source === '') return;
    const src = match(source);
    assert(source.startsWith(src));
    if (src === '') return;
    const memo = context.memo;
    memo && (memo.offset += source.length - src.length);
    const result = parser(src, context);
    assert(check(src, result));
    memo && (memo.offset -= source.length - src.length);
    if (!result) return;
    assert(exec(result).length < src.length);
    return exec(result).length < src.length
      ? [eval(result), exec(result) + source.slice(src.length)]
      : undefined;
  };
}

//export function rewrite<T, C extends Ctx, D extends Parser<unknown, C>[]>(scope: Parser<unknown, C, D>, parser: Parser<T, C, never>): Parser<T, C, D>;
export function rewrite<P extends Parser<unknown>>(scope: Parser<unknown, Context<P>>, parser: P): P;
export function rewrite<T>(scope: Parser<unknown>, parser: Parser<T>): Parser<T> {
  assert(scope);
  assert(parser);
  return (source, context = {}) => {
    if (source === '') return;
    const memo = context.memo;
    context.memo = undefined;
    const res1 = scope(source, context);
    assert(check(source, res1));
    context.memo = memo;
    if (!res1 || exec(res1).length >= source.length) return;
    const src = source.slice(0, source.length - exec(res1).length);
    assert(src !== '');
    assert(source.startsWith(src));
    memo && (memo.offset += source.length - src.length);
    const res2 = parser(src, context);
    assert(check(src, res2));
    memo && (memo.offset -= source.length - src.length);
    if (!res2) return;
    assert(exec(res2) === '');
    return exec(res2).length < src.length
      ? [eval(res2), exec(res2) + exec(res1)]
      : undefined;
  };
}
