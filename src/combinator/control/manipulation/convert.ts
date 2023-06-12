import { Parser, Ctx, Context, check } from '../../data/parser';
import { max } from 'spica/alias';

// 設計上キャッシュが汚染されるが運用で回避可能
// 変換の前または後のみキャッシュされるなら問題ない
export function convert<P extends Parser<unknown>>(conv: (source: string, context: Context<P>) => string, parser: P, empty?: boolean): P;
export function convert<T>(conv: (source: string, context: Ctx) => string, parser: Parser<T>, empty = false): Parser<T> {
  assert(parser);
  return ({ source, context }) => {
    if (source === '') return;
    const src = conv(source, context);
    if (src === '') return empty ? [[], ''] : undefined;
    const offset = max(source.length - src.length, 0);
    assert(offset >= 0);
    context.offset ??= 0;
    context.offset += offset;
    const result = parser({ source: src, context });
    assert(check(src, result));
    context.offset -= offset;
    return result;
  };
}
