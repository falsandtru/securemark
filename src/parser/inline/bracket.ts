import { BracketParser, inline } from '../inline';
import { build, combine, some, surround, transform } from '../../combinator';
import { squash } from '../util';

export const bracket: BracketParser = transform(build(() =>
  surround('[', some(combine<BracketParser>([inline]), ']'), ']')),
  (ns, rest) => [
    squash([document.createTextNode('['), ...ns, document.createTextNode(']')]),
    rest
  ]);
