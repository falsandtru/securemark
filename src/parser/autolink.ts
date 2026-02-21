import { MarkdownParser } from '../../markdown';
import { union, some, lazy } from '../combinator';
import { autolink as autolink_ } from './inline/autolink';
import { linebreak, unescsource } from './source';

export import AutolinkParser = MarkdownParser.AutolinkParser;

export const autolink: AutolinkParser = lazy(() =>
  some(union([
    autolink_,
    linebreak,
    unescsource,
  ])));
