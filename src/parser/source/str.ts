import { StrParser } from '../source';
import { Parser, Context } from '../../combinator/data/parser';
import { creation } from '../../combinator';

export function str(pattern: string | RegExp, not?: string): StrParser;
export function str(pattern: string | RegExp, not?: string): Parser<string, Context<StrParser>, []> {
  assert(pattern);
  return typeof pattern === 'string'
    ? creation(1, false, ({ source }) => {
        if (source === '') return;
        if (not && source.slice(pattern.length, pattern.length + not.length) === not) return;
        return source.slice(0, pattern.length) === pattern
          ? [[pattern], source.slice(pattern.length)]
          : undefined;
      })
    : creation(1, false, ({ source }) => {
        if (source === '') return;
        const m = source.match(pattern);
        if (m && not && source.slice(m[0].length, m[0].length + not.length) === not) return;
        return m && m[0].length > 0
          ? [[m[0]], source.slice(m[0].length)]
          : undefined;
      });
}
