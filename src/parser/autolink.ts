import { MarkdownParser } from '../../markdown';
import { union } from '../combinator';
import { autolink as a1 } from './inblock/autolink';
import { autolink as a2 } from './inline/autolink';
import { unescsource } from './source/unescapable';

export import AutolinkParser = MarkdownParser.AutolinkParser;

export const autolink: AutolinkParser = union<AutolinkParser>([
  a1,
  a2,
  unescsource
]);
