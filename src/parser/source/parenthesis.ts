import { ParenthesisParser } from '../source';
import { union, some, surround, transform, build } from '../../combinator';
import { escsource } from '../source/escapable';

const closer = /^\)|^\s/;

export const parenthesis: ParenthesisParser = transform(build(() =>
  surround('(', some(union<ParenthesisParser>([parenthesis, escsource]), closer), ')')),
  (ts, rest) => [
    [document.createTextNode('('), ...ts, document.createTextNode(')')],
    rest
  ]);
