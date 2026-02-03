import { Parser, Ctx, Context, check } from '../../data/parser';

export function convert<P extends Parser<unknown>>(conv: (source: string, context: Context<P>) => string, parser: P, continuous: boolean, empty?: boolean): P;
export function convert<T>(conv: (source: string, context: Ctx) => string, parser: Parser<T>, continuous: boolean, empty = false): Parser<T> {
  assert(parser);
  return ({ source, context }) => {
    if (source === '') return;
    const src = conv(source, context);
    if (src === '') return empty ? [[], ''] : undefined;
    const { backtracks } = context;
    assert(source.endsWith(src) || src.endsWith(source) || !continuous);
    context.backtracks = continuous ? backtracks : {};
    const result = parser({ source: src, context });
    assert(check(src, result));
    context.backtracks = backtracks;
    return result;
  };
}
