import { StrParser } from '../source';
import { Parser, creation } from '../../combinator';
import { text } from 'typed-dom';

export function str(pat: string | RegExp): StrParser;
export function str(pat: string | RegExp): Parser<Text, []> {
  return typeof pat === 'string'
    ? creation(source => {
        if (source === '') return;
        return source.slice(0, pat.length) === pat
          ? [[text(pat)], source.slice(pat.length)]
          : void 0;
      })
    : creation(source => {
        if (source === '') return;
        const m = source.match(pat);
        return m && m[0].length > 0
          ? [[text(m[0])], source.slice(m[0].length)]
          : void 0;
      });
};
