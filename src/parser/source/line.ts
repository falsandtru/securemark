import { Parser, eval, exec, line, firstline } from '../../combinator';
import { EmptyLineParser, BlankLineParser, ContentLineParser } from '../source';

export const emptyline: EmptyLineParser = line(takeLine(s => s.trim() === '' ? [[], ''] : undefined), false);
const invisible = /^(?:\\?[^\S\\]+)*\\?$/;
export const blankline: BlankLineParser = line(takeLine(s => s.search(invisible) === 0 ? [[], ''] : undefined), false);
export const contentline: ContentLineParser = line(takeLine(s => s.search(invisible) !== 0 ? [[], ''] : undefined), false);

function takeLine<P extends Parser<any, any>>(parser: P): P;
function takeLine<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return source => {
    if (source === '') return;
    const src = firstline(source);
    const rst = source.slice(src.length);
    const result = parser(src);
    return result
      ? [eval(result), exec(result) + rst]
      : undefined;
  };
}
