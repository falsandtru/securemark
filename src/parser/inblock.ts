import { MarkdownParser } from '../../markdown';
import { union, some, lazy } from '../combinator';
import { autolink } from './inblock/autolink';
import { inline } from './inline';

export import InblockParser = MarkdownParser.InblockParser;
export import AutolinkParser = InblockParser.AutolinkParser;

export const inblock: InblockParser = lazy(() => union<InblockParser>([
  autolink,
  some(inline, /^(?:([)\]])\1|[0-9a-zA-Z@]?@|\s#\S|\s+\[)/), inline
]));

export const incell: InblockParser = lazy(() => union<InblockParser>([
  autolink,
  some(inline, /^(?:([)\]])\1|[0-9a-zA-Z@]?@|\s#\S|\s*\|)/), inline
]));
