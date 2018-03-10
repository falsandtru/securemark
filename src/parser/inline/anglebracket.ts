import { AngleBracketParser, inline } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { squash } from '../squash';

const closer = /^>/;

export const anglebracket: AngleBracketParser = source =>
  transform(
    surround(
      '<',
      some(combine<AngleBracketParser>([inline]), closer),
      '>'),
    (ns, rest) => [
      squash([document.createTextNode('<'), ...ns, document.createTextNode('>')]),
      rest
    ])
    (source);
