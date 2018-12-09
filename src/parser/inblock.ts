import { MarkdownParser } from '../../markdown';
import { union, some, lazy } from '../combinator';
import { autolink } from './inblock/autolink';
import { inline } from './inline';

export import InblockParser = MarkdownParser.InblockParser;
export import AutolinkParser = InblockParser.AutolinkParser;

export const inblock: InblockParser = lazy(() => union<InblockParser>([
  autolink,
  some(inline, /^(?:\n|([)\]])\1|@[a-zA-Z0-9]|\\?\s#\S|\s+\[)/), inline
]));

export const incell: InblockParser = lazy(() => union<InblockParser>([
  autolink,
  some(inline, /^(?:\n|([)\]])\1|@[a-zA-Z0-9]|\\?\s#\S|\s*\|)/), inline
]));
