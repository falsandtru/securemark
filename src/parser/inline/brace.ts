import { BraceParser, inline } from '../inline';
import { build, combine, some, surround, transform } from '../../combinator';
import { squash } from '../util';

export const brace: BraceParser = transform(build(() =>
  surround('{', some(combine<BraceParser>([inline]), '}'), '}')),
  (ns, rest) => [
    squash([document.createTextNode('{'), ...ns, document.createTextNode('}')]),
    rest
  ]);
