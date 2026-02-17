import { Parser, Ctx, Context, failsafe } from '../../data/parser';

export function convert<P extends Parser<unknown>>(conv: (source: string, context: Context<P>) => string, parser: P, continuous: boolean, empty?: boolean): P;
export function convert<N>(conv: (source: string, context: Ctx) => string, parser: Parser<N>, continuous: boolean, empty = false): Parser<N> {
  assert(parser);
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    const src = conv(source.slice(position), context);
    if (src === '') {
      if (!empty) return;
      context.position = source.length;
      return [[]];
    }
    assert(source.endsWith(src) || src.endsWith(source.slice(position)) || !continuous);
    if (continuous) {
      context.position += source.length - position - src.length;
      const result = parser(input);
      assert(context.position > position || !result);
      context.source = source;
      return result;
    }
    else {
    const { offset, backtracks } = context;
      const result = parser({
        context: {
          ...context,
          source: src,
          position: 0,
          offset: undefined,
          backtracks: {},
        },
      });
      context.position = context.source.length
      assert(context.offset === offset);
      assert(context.source === source);
      assert(context.backtracks === backtracks);
      return result;
    }
  });
}
