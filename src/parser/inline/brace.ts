import { BraceParser, inline } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { squash } from '../squash';

const closer = /^}/;

export const brace: BraceParser = source =>
  transform(
    surround(
      '{',
      some(combine<BraceParser>([inline]), closer),
      '}'),
    (ns, rest) => [
      squash([document.createTextNode('{'), ...ns, document.createTextNode('}')]),
      rest
    ])
    (source);
