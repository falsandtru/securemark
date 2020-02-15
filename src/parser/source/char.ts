import { CharParser } from '../source';
import { Parser, creator } from '../../combinator';
import { text } from 'typed-dom';

export function char(char: string): CharParser;
export function char(char: string): Parser<Text, []> {
  assert(char.length === 1);
  return creator(source => {
    if (source === '') return;
    switch (source[0]) {
      case char:
        return [[text(source.slice(0, 1))], source.slice(1)];
      default:
        return;
    }
  });
};
