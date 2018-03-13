import { AngleBracketParser, inline } from '../inline';
import { build, combine, some, surround, transform } from '../../combinator';
import { squash } from '../squash';

export const anglebracket: AngleBracketParser = transform(build(() =>
  surround('<', some(combine<AngleBracketParser>([inline]), '>'), '>')),
  (ns, rest) => [
    squash([document.createTextNode('<'), ...ns, document.createTextNode('>')]),
    rest
  ]);
