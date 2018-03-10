import { BracketParser, inline } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { squash } from '../squash';

const closer = /^\]/;

export const bracket: BracketParser = source =>
  transform(
    surround(
      '[',
      some(combine<BracketParser>([inline]), closer),
      ']'),
    (ns, rest) => [
      squash([document.createTextNode('['), ...ns, document.createTextNode(']')]),
      rest
    ])
    (source);
