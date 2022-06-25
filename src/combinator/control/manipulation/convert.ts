import { undefined } from 'spica/global';
import { Parser } from '../../data/parser';

export function convert<P extends Parser<unknown>>(conv: (source: string) => string, parser: P): P;
export function convert<T>(conv: (source: string) => string, parser: Parser<T>): Parser<T> {
  assert(parser);
  return (source, context = {}) => {
    if (source === '') return;
    source = conv(source);
    if (source === '') return [[], ''];
    const memo = context.memo;
    context.memo = undefined;
    const result = parser(source, context);
    context.memo = memo;
    return result;
  };
}
