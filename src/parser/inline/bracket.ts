import { BracketParser, inline } from '../inline';
import { combine, loop, bracket as brkt, transform } from '../../combinator';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^\[[\s\S]*?\]/;
const closer = /^\]/;

export const bracket: BracketParser = (source: string) => {
  if (!validate(source, '[', syntax)) return;
  return transform(
    brkt(
      '[',
      loop(combine<HTMLElement | Text, BracketParser.InnerParsers>([inline]), closer),
      ']'),
    (ns, rest) => [
      [...squash([document.createTextNode('['), ...ns, document.createTextNode(']')]).childNodes as NodeListOf<HTMLElement | Text>],
      rest
    ])
    (source);
};
