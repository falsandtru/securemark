import { ParenthesisParser } from '../source';
import { combine, some, surround, transform } from '../../combinator';
import { match } from '../source/validation';
import { escsource } from '../source/escapable';

const syntax = /^\(\S*?\)/;
const closer = /^\)|^\s/;

export const parenthesis: ParenthesisParser = source => {
  if (!match(source, '(', syntax)) return;
  return transform(
    surround(
      '(',
      some(combine<ParenthesisParser>([parenthesis, escsource]), closer),
      ')'),
    (_, rest) => [
      [document.createTextNode(source.slice(0, source.length - rest.length))],
      rest
    ])
    (source);
};
