import { Parser, check } from '../../data/parser';

export function convert<P extends Parser<unknown>>(conv: (source: string) => string, parser: P): P;
export function convert<T>(conv: (source: string) => string, parser: Parser<T>): Parser<T> {
  assert(parser);
  return (source, context = {}) => {
    if (source === '') return;
    const src = conv(source);
    if (src === '') return [[], ''];
    const memo = context.memo;
    memo && (memo.offset += source.length - src.length);
    const result = parser(src, context);
    assert(check(src, result));
    memo && (memo.offset -= source.length - src.length);
    return result;
  };
}
