import { Parser, Context, eval, exec, check } from '../../data/parser';

export function focus<P extends Parser<unknown>>(scope: string | RegExp, parser: P): P;
export function focus<T>(scope: string | RegExp, parser: Parser<T>): Parser<T> {
  assert(scope instanceof RegExp ? !scope.flags.match(/[gmy]/) && scope.source.startsWith('^') : scope);
  assert(parser);
  const match: (source: string) => string = typeof scope === 'string'
    ? source => source.slice(0, scope.length) === scope ? scope : ''
    : source => source.match(scope)?.[0] ?? '';
  return ({ source, context }) => {
    if (source === '') return;
    const src = match(source);
    assert(source.startsWith(src));
    if (src === '') return;
    const offset = source.length - src.length;
    assert(offset >= 0);
    context.offset ??= 0;
    context.offset += offset;
    const result = parser({ source: src, context });
    assert(check(src, result));
    context.offset -= offset;
    if (result === undefined) return;
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
  return ({ source, context }) => {
    if (source === '') return;
    const { logger } = context;
    context.logger = {};
    //const { resources = { clock: 0 } } = context;
    //const clock = resources.clock;
    const res1 = scope({ source, context });
    assert(check(source, res1));
    //resources.clock = clock;
    context.logger = logger;
    if (res1 === undefined || exec(res1).length >= source.length) return;
    const src = source.slice(0, source.length - exec(res1).length);
    assert(src !== '');
    assert(source.startsWith(src));
    const offset = source.length - src.length;
    assert(offset >= 0);
    context.offset ??= 0;
    context.offset += offset;
    const res2 = parser({ source: src, context });
    assert(check(src, res2));
    context.offset -= offset;
    if (res2 === undefined) return;
    assert(exec(res2) === '');
    return exec(res2).length < src.length
      ? [eval(res2), exec(res2) + exec(res1)]
      : undefined;
  };
}
