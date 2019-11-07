import { CharParser } from '../source';
import { Parser } from '../../combinator';
import { text } from 'typed-dom';

export function char(char: '#'): CharParser.SharpParser;
export function char(char: '>'): CharParser.GreaterThanParser;
export function char(char: '!'): CharParser.ExclamationParser;
export function char(char: '='): CharParser.EqualParser;
export function char(char: string): Parser<Text, []> {
  return (source, state) => {
    if (source === '') return;
    switch (source[0]) {
      case char:
        return [[text(source.slice(0, 1))], source.slice(1), state];
      default:
        return;
    }
  };
};
