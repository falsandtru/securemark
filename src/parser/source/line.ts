import { Parser } from '../../combinator';
import { EmptyLineParser, FakeemptyLineParser, NonemptyLineParser } from '../source';
import { block } from './block';

export function line<P extends Parser<any, any>>(parser: P, entire?: boolean, force?: boolean): P;
export function line<S extends Parser<any, any>[], R>(parser: Parser<R, S>, entire = true, force = false): Parser<R, S> {
  return source => {
    if (source.length === 0) return;
    if (force) {
      const src = source.split('\n', 1)[0];
      const rst = source.slice(src.length + 1);
      const result = line(parser, entire, false)(`${src}${source.length > src.length ? source[src.length] : ''}`);
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

export const emptyline: EmptyLineParser = line(s => s.trim() === '' ? [[], ''] : undefined, false, true);
export const nonemptyline: NonemptyLineParser = line(s => s.trim() !== '' ? [[], ''] : undefined, false, true);

const fake = /^(?:\\?\s)*?\\?$/;
export const fakeemptyline: FakeemptyLineParser = line(s => s.search(fake) === 0 ? [[], ''] : undefined, false, true);
