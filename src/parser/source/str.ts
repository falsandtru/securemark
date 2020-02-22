import { StrParser } from '../source';
import { Parser, creator } from '../../combinator';
import { text } from 'typed-dom';

export function str(pattern: string | RegExp): StrParser;
export function str(pattern: string | RegExp): Parser<Text, []> {
  return typeof pattern === 'string'
    ? creator(source => {
        if (source === '') return;
        return source.slice(0, pattern.length) === pattern
          ? [[text(pattern)], source.slice(pattern.length)]
          : void 0;
      })
    : creator(source => {
        if (source === '') return;
        const m = source.match(pattern);
        return m && m[0].length > 0
          ? [[text(m[0])], source.slice(m[0].length)]
          : void 0;
      });
};
