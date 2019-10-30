import { CharParser, Config } from '../source';
import { Parser } from '../../combinator';
import { text } from 'typed-dom';

export function char(char: '!'): CharParser.ExclamationParser;
export function char(char: '='): CharParser.EqualParser;
export function char(char: string): Parser<Text, [], Config> {
  return (source, config) => {
    if (source === '') return;
    switch (source[0]) {
      case char:
        return [[text(source.slice(0, 1))], source.slice(1), config];
      default:
        return;
    }
  };
};
