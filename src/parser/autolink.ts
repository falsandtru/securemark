import { MarkdownParser } from '../../markdown';
import { union, validate } from '../combinator';
import { autolink as al } from './inline/autolink';
import { unescsource } from './source/unescapable';

export import AutolinkParser = MarkdownParser.AutolinkParser;

export const autolink: AutolinkParser = union([
  validate(/^[^!]/, al),
  unescsource
]);
