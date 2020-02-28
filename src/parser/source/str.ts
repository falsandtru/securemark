import { StrParser } from '../source';
import { Parser, creator } from '../../combinator';

export function str(pattern: string | RegExp): StrParser;
export function str(pattern: string | RegExp): Parser<string, []> {
  return typeof pattern === 'string'
    ? creator(source => {
        if (source === '') return;
        return source.slice(0, pattern.length) === pattern
          ? [[pattern], source.slice(pattern.length)]
          : void 0;
      })
    : creator(source => {
        if (source === '') return;
        const m = source.match(pattern);
        return m && m[0].length > 0
          ? [[m[0]], source.slice(m[0].length)]
          : void 0;
      });
};
