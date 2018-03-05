import { AngleBracketParser, inline } from '../inline';
import { combine, some, bracket, transform } from '../../combinator';
import { squash } from '../squash';
import { match } from '../source/validation';

const syntax = /^<[\s\S]*?>/;
const closer = /^>/;

export const anglebracket: AngleBracketParser = source => {
  if (!match(source, '<', syntax)) return;
  return transform(
    bracket(
      '<',
      some(combine<AngleBracketParser>([inline]), closer),
      '>'),
    (ns, rest) => [
      squash([document.createTextNode('<'), ...ns, document.createTextNode('>')]),
      rest
    ])
    (source);
};
