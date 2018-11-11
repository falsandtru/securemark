import { MarkdownParser } from '../../markdown';
import { union, some, build } from '../combinator';
import { autolink } from './inblock/autolink';
import { inline } from './inline';

export import InblockParser = MarkdownParser.InblockParser;
export import AutolinkParser = InblockParser.AutolinkParser;

export const inblock: InblockParser = build(() => union<InblockParser>([
  autolink,
  some(inline, /^(?:([)\]])\1|[0-9a-zA-Z@]?@|\s#\S|\s+\[)/), inline
]));

export const incell: InblockParser = build(() => union<InblockParser>([
  autolink,
  some(inline, /^(?:([)\]])\1|[0-9a-zA-Z@]?@|\s#\S|\s*\|)/), inline
]));
