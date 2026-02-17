import { Parser, Context, input, eval, failsafe } from '../../data/parser';
import { consume } from '../../../combinator';

export function focus<P extends Parser<unknown>>(scope: string | RegExp, parser: P, cost?: boolean): P;
export function focus<N>(scope: string | RegExp, parser: Parser<N>, cost = true): Parser<N> {
  assert(scope instanceof RegExp ? !scope.flags.match(/[gmy]/) && scope.source.startsWith('^') : scope);
  assert(parser);
  const match: (source: string, position: number) => string = typeof scope === 'string'
    ? (source, position) => source.slice(position, position + scope.length) === scope ? scope : ''
    : (source, position) => source.slice(position).match(scope)?.[0] ?? '';
  return failsafe(({ context }) => {
    const { source, position } = context;
    if (position === source.length) return;
    const src = match(source, position);
    assert(source.slice(position).startsWith(src));
    if (src === '') return;
    cost && consume(src.length, context);
    context.recent = [src];
    context.offset ??= 0;
    context.offset += position;
    const result = parser(input(src, context));
    context.position += position;
    context.position += result && context.position === position ? src.length : 0;
    assert(context.position > position || !result);
    context.source = source;
    context.offset -= position;
    if (result === undefined) return;
    return [eval(result)];
  });
}

//export function rewrite<N, C extends Ctx, D extends Parser<unknown, C>[]>(scope: Parser<unknown, C, D>, parser: Parser<N, C, never>): Parser<N, C, D>;
export function rewrite<P extends Parser<unknown>>(scope: Parser<unknown, Context<P>>, parser: P): P;
export function rewrite<N>(scope: Parser<unknown>, parser: Parser<N>): Parser<N> {
  assert(scope);
  assert(parser);
  return failsafe(({ context }) => {
    const { source, position } = context;
    if (position === source.length) return;
    // 影響する使用はないはず
    //const { backtracks } = context;
    //context.backtracks = {};
    const res1 = scope({ context });
    assert(context.position > position || !res1);
    //context.backtracks = backtracks;
    if (res1 === undefined || context.position < position) return;
    const src = source.slice(position, context.position);
    assert(src !== '');
    assert(source.slice(position).startsWith(src));
    context.offset ??= 0;
    context.offset += position;
    const res2 = parser(input(src, context));
    context.position += position;
    context.position += res2 && context.position === position ? src.length : 0;
    assert(context.position > position || !res2);
    context.source = source;
    context.offset -= position;
    if (res2 === undefined) return;
    assert(context.position === position + src.length);
    return [eval(res2)];
  });
}
