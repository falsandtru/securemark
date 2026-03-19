import { Parser, List, Context, subinput, failsafe } from '../../data/parser';

export function convert<P extends Parser>(conv: (source: string, context: Parser.Context<P>) => string, parser: P): P;
export function convert<N>(conv: (source: string, context: Context) => string, parser: Parser<N>): Parser<N> {
  assert(parser);
  return failsafe(input => {
    const context = input;
    const { source, position, offset } = context;
    if (position === source.length) return;
    const src = conv(source.slice(position), context);
    assert(context.position === position);
    if (src === '') {
      context.position = source.length;
      return new List();
    }
    const result = parser(subinput(src, context));
    context.position = context.source.length
    assert(context.source === source);
    assert(context.offset === offset);
    return result;
  });
}
