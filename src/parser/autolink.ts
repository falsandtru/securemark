import { MarkdownParser } from '../../markdown';
import { union, some, convert, lazy } from '../combinator';
import { autolink as autolink_ } from './inline/autolink';
import { linebreak, unescsource } from './source';

export import AutolinkParser = MarkdownParser.AutolinkParser;

export const autolink: AutolinkParser = lazy(() =>
  convert(source => `\r${source}`,
  some(union([
    autolink_,
    linebreak,
    unescsource,
  ])),
  false));
