import { MarkdownParser } from '../../markdown';
import { union, lazy } from '../combinator';
import { autolink as autolink_ } from './inline/autolink';
import { linebreak, unescsource } from './source';

export import AutolinkParser = MarkdownParser.AutolinkParser;

const delimiter = /[@#>0-9A-Za-z\n]|\S[#>]/;

export const autolink: AutolinkParser = (source, context) => {
  if (source === '') return;
  assert(source[0] !== '\x1B');
  const i = source.search(delimiter);
  switch (i) {
    case -1:
      return [[source], ''];
    case 0:
      return parser(source, context);
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
};

const parser: AutolinkParser = lazy(() => union([
  autolink_,
  linebreak,
  unescsource
]));
