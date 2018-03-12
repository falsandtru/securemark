import { BracketParser, inline } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { squash } from '../squash';

export const bracket: BracketParser = source =>
  transform(
    surround('[', some(combine<BracketParser>([inline]), ']'), ']'),
    (ns, rest) => [
      squash([document.createTextNode('['), ...ns, document.createTextNode(']')]),
      rest
    ])
    (source);
