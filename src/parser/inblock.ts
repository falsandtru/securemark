import { MarkdownParser } from '../../markdown';
import { union, inits, some } from '../combinator';
import { annotation } from './inblock/annotation';
import { authority } from './inblock/authority';
import { autolink } from './inblock/autolink';
import { inline } from './inline';
import { char } from './source/char';

export import InblockParser = MarkdownParser.InblockParser;
export import AnnotationParser = InblockParser.AnnotationParser;
export import AuthorityParser = InblockParser.AuthorityParser;
export import AutolinkParser = InblockParser.AutolinkParser;

export const inblock: InblockParser = union<InblockParser>([
  inits([annotation, some(char('#'))]) as AnnotationParser,
  inits([authority, some(char('#'))]) as AuthorityParser,
  autolink,
  some(inline, /^(?:([\[\]\(\)])\1|[0-9a-zA-Z@]?@|\s#\S|\s+\[)/), inline
]);

export const incell: InblockParser = union<InblockParser>([
  inits([annotation, some(char('#'))]) as AnnotationParser,
  inits([authority, some(char('#'))]) as AuthorityParser,
  autolink,
  some(inline, /^(?:([\[\]\(\)])\1|[0-9a-zA-Z@]?@|\s#\S|\s*\|)/), inline
]);
