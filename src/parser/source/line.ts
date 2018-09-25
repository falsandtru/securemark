import { Parser, eval, exec, line, firstline } from '../../combinator';
import { AnyLineParser, EmptyLineParser, BlankLineParser, ContentLineParser } from '../source';
import { validate } from '../../combinator/data/parser';

export const anyline: AnyLineParser = line(takeLine(_ => [[], '']), false);
export const emptyline: EmptyLineParser = line(takeLine(s => s.trim() === '' ? [[], ''] : undefined), false);

const invisible = /^(?:\\?\s)*$/;
export const blankline: BlankLineParser = line(takeLine(s => s.search(invisible) === 0 ? [[], ''] : undefined), false);
export const contentline: ContentLineParser = line(takeLine(s => s.search(invisible) !== 0 ? [[], ''] : undefined), false);

function takeLine<P extends Parser<any, any>>(parser: P): P;
function takeLine<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    const src = firstline(source);
    const rst = source.slice(src.length);
    const result = parser(src);
    assert(validate(src, result));
    return result
      ? [eval(result), exec(result) + rst]
      : undefined;
  };
}
