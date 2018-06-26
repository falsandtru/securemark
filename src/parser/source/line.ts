import { Parser, eval, exec } from '../../combinator';
import { EmptyLineParser, BlankLineParser, ContentLineParser } from '../source';
import { block } from './block';

export function line<P extends Parser<any, any>>(parser: P, entire?: boolean, force?: boolean): P;
export function line<T, S extends Parser<any, any>[]>(parser: Parser<T, S>, entire = true, force = false): Parser<T, S> {
  return source => {
    if (source.length === 0) return;
    if (force) {
      const src = firstline(source);
      const rst = source.slice(src.length + 1);
      const result = line(parser, entire, false)(src + (source.length > src.length ? source[src.length] : ''));
      return result
        ? [eval(result), exec(result) + rst]
        : undefined;
    }
    const result = entire
      ? block(parser, false)(source)
      : parser(source);
    if (!result) return result;
    const src = source.slice(0, source.length - exec(result).length);
    return src === '\n' || src.lastIndexOf('\n', src.length - 2) === -1
      ? result
      : undefined;
  };
}

export function firstline(source: string): string {
  const i = source.indexOf('\n');
  return i === -1
    ? source
    : source.slice(0, i);
}

export const emptyline: EmptyLineParser = line(s => s.trim() === '' ? [[], ''] : undefined, true, true);
const invisible = /^(?:\\?[^\S\\]+)*\\?$/;
export const blankline: BlankLineParser = line(s => s.search(invisible) === 0 ? [[], ''] : undefined, true, true);
export const contentline: ContentLineParser = line(s => s.search(invisible) !== 0 ? [[], ''] : undefined, true, true);
