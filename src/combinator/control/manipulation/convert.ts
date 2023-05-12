import { Parser, Ctx, Context, check } from '../../data/parser';

export function convert<P extends Parser<unknown>>(conv: (source: string, context: Context<P>) => string, parser: P, empty?: boolean): P;
export function convert<T>(conv: (source: string, context: Ctx) => string, parser: Parser<T>, empty = false): Parser<T> {
  assert(parser);
  return ({ source, context }) => {
    if (source === '') return;
    const src = conv(source, context);
    if (src === '') return empty ? [[], ''] : undefined;
    context.offset ??= 0;
    context.offset += source.length - src.length;
    const result = parser({ source: src, context });
    assert(check(src, result));
    context.offset -= source.length - src.length;
    return result;
  };
}
