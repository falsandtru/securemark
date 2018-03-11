import { Parser } from '../../combinator';
import { EmptyLineParser, NonemptyLineParser, VisibleLineParser, InvisibleLineParser } from '../source';
import { block } from './block';

export function line<P extends Parser<any, any>>(parser: P, entire?: boolean, force?: boolean): P;
export function line<S extends Parser<any, any>[], R>(parser: Parser<R, S>, entire = true, force = false): Parser<R, S> {
  return source => {
    if (source.length === 0) return;
    if (force) {
      const src = firstline(source);
      const rst = source.slice(src.length + 1);
      const result = line(parser, entire, false)(src + (source.length > src.length ? source[src.length] : ''));
      return result
        ? [result[0], result[1] + rst]
        : undefined;
    }
    const result = entire
      ? block(parser)(source)
      : parser(source);
    if (!result) return result;
    const src = source.slice(0, source.length - result[1].length);
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
export const nonemptyline: NonemptyLineParser = line(s => s.trim() !== '' ? [[], ''] : undefined, true, true);

const invisible = /^(?:\\?\s)*?\\?$/;
export const visibleline: VisibleLineParser = line(s => s.search(invisible) !== 0 ? [[], ''] : undefined, true, true);
export const invisibleline: InvisibleLineParser = line(s => s.search(invisible) === 0 ? [[], ''] : undefined, true, true);
