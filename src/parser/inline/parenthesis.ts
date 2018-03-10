import { ParenthesisParser, inline } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { squash } from '../squash';

const closer = /^\)/;

export const parenthesis: ParenthesisParser = source =>
  transform(
    surround(
      '(',
      some(combine<ParenthesisParser>([inline]), closer),
      ')'),
    (ns, rest) => [
      squash([document.createTextNode('('), ...ns, document.createTextNode(')')]),
      rest
    ])
    (source);
