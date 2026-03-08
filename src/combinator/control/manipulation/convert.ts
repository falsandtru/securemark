import { Parser, List, Ctx, Context, subinput, failsafe } from '../../data/parser';

export function convert<P extends Parser>(conv: (source: string, context: Context<P>) => string, parser: P, empty?: boolean): P;
export function convert<N>(conv: (source: string, context: Ctx) => string, parser: Parser<N>, empty = false): Parser<N> {
  assert(parser);
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    const src = conv(source.slice(position), context);
    assert(context.position === position);
    if (src === '') {
      if (!empty) return;
      context.position = source.length;
      return new List();
    }
    const { offset, backtracks } = context;
    const result = parser(subinput(src, context));
    context.position = context.source.length
    assert(context.offset === offset);
    assert(context.source === source);
    assert(context.backtracks === backtracks);
    return result;
  });
}
