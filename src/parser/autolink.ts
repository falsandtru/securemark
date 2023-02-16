import { MarkdownParser } from '../../markdown';
import { union, tails, subsequence, some, line, focus, lazy } from '../combinator';
import { link } from './inline/link';
import { autolink as autolink_ } from './inline/autolink';
import { linebreak, unescsource, str } from './source';
import { format } from './util';

export import AutolinkParser = MarkdownParser.AutolinkParser;

export const autolink: AutolinkParser = lazy(() => line(subsequence([
  lineurl,
  some(union([
    autolink_,
    linebreak,
    unescsource,
  ])),
])));

export const lineurl: AutolinkParser.LineUrlParser = lazy(() => focus(
  /^!?https?:\/\/\S+(?=[^\S\n]*(?:$|\n))/,
  format(tails([str('!'), link]))));
