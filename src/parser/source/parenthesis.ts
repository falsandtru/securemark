import { ParenthesisParser } from '../source';
import { loop, bracket, transform } from '../../combinator';
import { escsource } from '../source/escapable';
import { match } from '../source/validation';

const syntax = /^\([\s\S]*?\)/;
const closer = /^\)|^\n/;

export const parenthesis: ParenthesisParser = (source: string) => {
  if (!match(source, '(', syntax)) return;
  return transform(
    bracket(
      '(',
      loop(escsource, closer),
      ')'),
    (_, rest) => [
      [document.createTextNode(source.slice(0, source.length - rest.length))],
      rest
    ])
    (source);
};
