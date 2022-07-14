import { Parser, check } from '../../data/parser';

export function convert<P extends Parser<unknown>>(conv: (source: string) => string, parser: P): P;
export function convert<T>(conv: (source: string) => string, parser: Parser<T>): Parser<T> {
  assert(parser);
  return input => {
    const { source, context } = input;
    if (source === '') return;
    const src = conv(source);
    if (src === '') return [[], ''];
    context.offset ??= 0;
    context.offset += source.length - src.length;
    const result = parser({ source: src, context });
    assert(check(src, result));
    context.offset -= source.length - src.length;
    return result;
  };
}
