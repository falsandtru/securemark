import { Parser, input, failsafe } from '../../data/parser';
import { matcher } from '../../data/delimiter';

export function focus<P extends Parser>(scope: string | RegExp, parser: P, slice?: boolean): P;
export function focus<N>(scope: string | RegExp, parser: Parser<N>, slice = true): Parser<N> {
  assert(parser);
  const match = matcher(scope, false);
  return failsafe(arg => {
    const { context } = arg;
    const { source, position } = context;
    if (position === source.length) return;
    const src = match({ context })?.head?.value ?? '';
    assert(source.startsWith(src, position));
    if (src === '') return;
    const range = context.range = src.length;
    if (!slice) {
      const result = parser(arg);
      context.position += result && context.position === position ? range : 0;
      return result;
    }
    context.offset += position;
    const result = parser(input(src, context));
    context.position += position;
    context.position += result && context.position === position ? src.length : 0;
    context.source = source;
    context.offset -= position;
    return result;
  });
}

//export function rewrite<N, C extends Ctx, D extends Parser<unknown, C>[]>(scope: Parser<unknown, C, D>, parser: Parser<N, C, never>): Parser<N, C, D>;
export function rewrite<P extends Parser>(scope: Parser<unknown, Parser.Context<P>>, parser: P, slice?: boolean): P;
export function rewrite<N>(scope: Parser, parser: Parser<N>, slice = true): Parser<N> {
  assert(scope);
  assert(parser);
  return failsafe(arg => {
    const { context } = arg;
    const { source, position } = context;
    if (position === source.length) return;
    const res1 = scope({ context });
    assert(context.position > position || !res1);
    if (res1 === undefined || context.position < position) return;
    const range = context.range = context.position - position;
    if (!slice) {
      context.position = position;
      const res2 = parser(arg);
      context.position += res2 && context.position === position ? range : 0;
      return res2;
    }
    const src = source.slice(position, context.position);
    assert(src !== '');
    assert(source.startsWith(src, position));
    context.offset += position;
    const res2 = parser(input(src, context));
    context.position += position;
    context.position += res2 && context.position === position ? src.length : 0;
    context.source = source;
    context.offset -= position;
    return res2;
  });
}
