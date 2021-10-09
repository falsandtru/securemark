import { undefined } from 'spica/global';
import { StrParser } from '../source';
import { Parser, Context } from '../../combinator/data/parser';
import { creator } from '../../combinator';

export function str(pattern: string | RegExp, mustConsume?: boolean): StrParser;
export function str(pattern: string | RegExp, mustConsume = true): Parser<string, Context<StrParser>, []> {
  assert(pattern);
  return typeof pattern === 'string'
    ? creator(source => {
        if (source === '') return;
        return source.slice(0, pattern.length) === pattern
          ? [[pattern], source.slice(pattern.length)]
          : undefined;
      })
    : creator(source => {
        if (source === '') return;
        const m = source.match(pattern);
        return m && (!mustConsume || m[0].length > 0)
          ? [[m[0]], source.slice(m[0].length)]
          : undefined;
      });
};
