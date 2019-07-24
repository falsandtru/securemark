import { MarkdownParser } from '../../markdown';
import { union, focus } from '../combinator';
import { autolink as al } from './inline/autolink';
import { text } from './source/text';
import { unescsource } from './source/unescapable';

export import AutolinkParser = MarkdownParser.AutolinkParser;

export const autolink: AutolinkParser = union([
  al,
  focus(/^\n/, text),
  unescsource
]);
