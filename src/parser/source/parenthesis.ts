﻿import { ParenthesisParser } from '../source';
import { combine, loop, bracket, transform } from '../../combinator';
import { escsource } from '../source/escapable';
import { match } from '../source/validation';

const syntax = /^\(\S*?\)/;
const closer = /^\)|^\s/;

export const parenthesis: ParenthesisParser = (source: string) => {
  if (!match(source, '(', syntax)) return;
  return transform(
    bracket(
      '(',
      loop(combine<Text, ParenthesisParser.InnerParsers>([parenthesis, escsource]), closer),
      ')'),
    (_, rest) => [
      [document.createTextNode(source.slice(0, source.length - rest.length))],
      rest
    ])
    (source);
};
