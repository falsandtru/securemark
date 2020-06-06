import { undefined } from 'spica/global';
import { CharParser } from '../source';
import { Parser, creator } from '../../combinator';

export function char(char: string): CharParser;
export function char(char: string): Parser<string, []> {
  assert(char.length === 1);
  return creator(source => {
    if (source === '') return;
    return source[0] === char
      ? [[char], source.slice(char.length)]
      : undefined;
  });
};
