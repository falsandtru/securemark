import { BraceParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { squash } from '../squash';
import { match } from '../source/validation';

const syntax = /^{[\s\S]*?}/;
const closer = /^}/;

export const brace: BraceParser = source => {
  if (!match(source, '{', syntax)) return;
  return transform(
    bracket(
      '{',
      loop(combine<BraceParser>([inline]), closer),
      '}'),
    (ns, rest) => [
      squash([document.createTextNode('{'), ...ns, document.createTextNode('}')]),
      rest
    ])
    (source);
};
