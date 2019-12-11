import { MarkdownParser } from '../../markdown';
import { union } from '../combinator';
import { autolink as autolink_ } from './inline';
import { newline, unescsource } from './source';

export import Config = MarkdownParser.Config;
export import AutolinkParser = MarkdownParser.AutolinkParser;

export const autolink: AutolinkParser = union([
  autolink_,
  newline,
  unescsource
]);
