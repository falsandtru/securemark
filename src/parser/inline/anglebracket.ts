import { AngleBracketParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { squash } from '../squash';
import { match } from '../source/validation';

const syntax = /^<[\s\S]*?>/;
const closer = /^>/;

export const anglebracket: AngleBracketParser = (source: string) => {
  if (!match(source, '<', syntax)) return;
  return transform(
    bracket(
      '<',
      loop(combine<HTMLElement | Text, AngleBracketParser.InnerParsers>([inline]), closer),
      '>'),
    (ns, rest) => [
      [...squash([document.createTextNode('<'), ...ns, document.createTextNode('>')]).childNodes as NodeListOf<HTMLElement | Text>],
      rest
    ])
    (source);
};
