import { undefined } from 'spica/global';
import { StrParser } from '../source';
import { Parser, creator } from '../../combinator';
import { Context } from '../../combinator/data/parser';

export function str(pattern: string | RegExp, not?: string): StrParser;
export function str(pattern: string | RegExp, not?: string): Parser<string, Context<StrParser>, []> {
  assert(pattern);
  return typeof pattern === 'string'
    ? creator(source => {
        if (source === '') return;
        return source.slice(0, pattern.length) === pattern
            && !(not && source.slice(pattern.length, pattern.length + not.length) === not)
          ? [[pattern], source.slice(pattern.length)]
          : undefined;
      })
    : creator(source => {
        if (source === '') return;
        const m = source.match(pattern);
        return m && m[0].length > 0
            && !(not && source.slice(m[0].length, m[0].length + not.length) === not)
          ? [[m[0]], source.slice(m[0].length)]
          : undefined;
      });
};
