import { StrParser } from '../source';
import { Parser, Context } from '../../combinator/data/parser';
import { consume } from '../../combinator';

export function str(pattern: string | RegExp, not?: string): StrParser;
export function str(pattern: string | RegExp, not?: string): Parser<string, Context<StrParser>, []> {
  assert(pattern);
  const count = typeof pattern === 'object'
    ? pattern.source.length > 9 || /[^^\\*+][*+]/.test(pattern.source)
    : false;
  return typeof pattern === 'string'
    ? ({ source }) => {
        if (source === '') return;
        if (not && source.slice(pattern.length, pattern.length + not.length) === not) return;
        return source.slice(0, pattern.length) === pattern
          ? [[pattern], source.slice(pattern.length)]
          : undefined;
      }
    : ({ source, context }) => {
        if (source === '') return;
        const m = source.match(pattern);
        count && m && consume(m[0].length, context);
        if (m && not && source.slice(m[0].length, m[0].length + not.length) === not) return;
        return m && m[0].length > 0
          ? [[m[0]], source.slice(m[0].length)]
          : undefined;
      };
}
