import { StrParser } from '../source';
import { Parser, Context } from '../../combinator/data/parser';
import { consume } from '../../combinator';

export function str(pattern: string | RegExp, not?: string): StrParser;
export function str(pattern: string | RegExp, not?: string): Parser<string, Context<StrParser>, []> {
  assert(pattern);
  const count = typeof pattern === 'object'
    ? /[^^\\*+][*+]/.test(pattern.source)
    : false;
  return typeof pattern === 'string'
    ? ({ context }) => {
        const { source, position } = context;
        if (position === source.length) return;
        if (not && source.slice(position+pattern.length, position+pattern.length + not.length) === not) return;
        if (source.slice(position, position + pattern.length) !== pattern) return;
        context.position += pattern.length;
        return [[pattern], source.slice(position + pattern.length)];
      }
    : ({ context }) => {
        const { source, position } = context;
        if (position === source.length) return;
        const m = source.slice(position).match(pattern);
        if (m === null) return;
        count && consume(m[0].length, context);
        if (not && source.slice(position + m[0].length, position + m[0].length + not.length) === not) return;
        context.position += m[0].length;
        return [[m[0]], source.slice(position + m[0].length)];
      };
}
