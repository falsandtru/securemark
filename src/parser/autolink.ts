import { MarkdownParser } from '../../markdown';
import { union, focus } from '../combinator';
import { autolink as al } from './inline/autolink';
import { text, unescsource } from './source';

export import AutolinkParser = MarkdownParser.AutolinkParser;

export const autolink: AutolinkParser = union([
  al,
  focus(/^\n/, text),
  unescsource
]);
