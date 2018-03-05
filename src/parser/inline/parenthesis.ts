import { ParenthesisParser, inline } from '../inline';
import { combine, some, bracket, transform } from '../../combinator';
import { squash } from '../squash';
import { match } from '../source/validation';

const syntax = /^\([\s\S]*?\)/;
const closer = /^\)/;

export const parenthesis: ParenthesisParser = source => {
  if (!match(source, '(', syntax)) return;
  return transform(
    bracket(
      '(',
      some(combine<ParenthesisParser>([inline]), closer),
      ')'),
    (ns, rest) => [
      squash([document.createTextNode('('), ...ns, document.createTextNode(')')]),
      rest
    ])
    (source);
};
