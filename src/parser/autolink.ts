import { MarkdownParser } from '../../markdown';
import { union } from '../combinator';
import { autolink as al } from './inline';
import { newline, unescsource } from './source';

export import AutolinkParser = MarkdownParser.AutolinkParser;

export const autolink: AutolinkParser = union([
  al,
  newline,
  unescsource
]);
