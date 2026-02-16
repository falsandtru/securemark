import { Parser, Context, input, eval, exec, check, failsafe } from '../../data/parser';
import { consume } from '../../../combinator';

export function focus<P extends Parser<unknown>>(scope: string | RegExp, parser: P, cost?: boolean): P;
export function focus<N>(scope: string | RegExp, parser: Parser<N>, cost = true): Parser<N> {
  assert(scope instanceof RegExp ? !scope.flags.match(/[gmy]/) && scope.source.startsWith('^') : scope);
  assert(parser);
  const match: (source: string) => string = typeof scope === 'string'
    ? source => source.slice(0, scope.length) === scope ? scope : ''
    : source => source.match(scope)?.[0] ?? '';
  return failsafe(({ source, context }) => {
    if (source === '') return;
    const src = match(source);
    assert(source.startsWith(src));
    if (src === '') return;
    cost && consume(src.length, context);
    const offset = source.length - src.length;
    assert(offset >= 0);
    context.offset ??= 0;
    context.offset += offset;
    const result = parser(input(src, context));
    assert(check(src, result));
    context.offset -= offset;
    if (result === undefined) return;
    assert(exec(result).length < src.length);
    return exec(result).length < src.length
      ? [eval(result), exec(result) + source.slice(src.length)]
      : undefined;
  });
}

//export function rewrite<N, C extends Ctx, D extends Parser<unknown, C>[]>(scope: Parser<unknown, C, D>, parser: Parser<N, C, never>): Parser<N, C, D>;
export function rewrite<P extends Parser<unknown>>(scope: Parser<unknown, Context<P>>, parser: P): P;
export function rewrite<N>(scope: Parser<unknown>, parser: Parser<N>): Parser<N> {
  assert(scope);
  assert(parser);
  return failsafe(({ source, context }) => {
    if (source === '') return;
    // 影響する使用はないはず
    //const { backtracks } = context;
    //context.backtracks = {};
    const res1 = scope({ source, context });
    assert(check(source, res1));
    //context.backtracks = backtracks;
    if (res1 === undefined || exec(res1).length >= source.length) return;
    const src = source.slice(0, source.length - exec(res1).length);
    assert(src !== '');
    assert(source.startsWith(src));
    const offset = source.length - src.length;
    assert(offset >= 0);
    context.offset ??= 0;
    context.offset += offset;
    const res2 = parser(input(src, context));
    assert(check(src, res2));
    context.offset -= offset;
    if (res2 === undefined) return;
    assert(exec(res2) === '');
    return exec(res2).length < src.length
      ? [eval(res2), exec(res2) + exec(res1)]
      : undefined;
  });
}
