import { ParenthesisParser, inline } from '../inline';
import { build, combine, some, surround, transform } from '../../combinator';
import { squash } from '../util';

export const parenthesis: ParenthesisParser = transform(build(() =>
  surround('(', some(combine<ParenthesisParser>([inline]), ')'), ')')),
  (ns, rest) => [
    squash([document.createTextNode('('), ...ns, document.createTextNode(')')]),
    rest
  ]);
