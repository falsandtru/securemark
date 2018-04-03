import { Parser } from '../../combinator';
import { CharParser } from '../source';

export function char(char: '`'): CharParser.BackquoteParser;
export function char(char: string): Parser<Text, never[]> {
  return source => {
    if (source.length === 0) return;
    switch (source[0]) {
      case char:
        return [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
      default:
        return;
    }
  };
};
