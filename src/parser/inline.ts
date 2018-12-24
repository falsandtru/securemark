import { MarkdownParser } from '../../markdown.d';
import { union, inits, some } from '../combinator';
import { annotation } from './inline/annotation';
import { authority } from './inline/authority';
import { extension } from './inline/extension';
import { link } from './inline/link';
import { ruby } from './inline/ruby';
import { html } from './inline/html';
import { comment } from './inline/comment';
import { emphasis } from './inline/emphasis';
import { strong } from './inline/strong';
import { code } from './inline/code';
import { math } from './inline/math';
import { media } from './inline/media';
import { bracket } from './inline/bracket';
import { htmlentity } from './inline/htmlentity';
import { autolink } from './inline/autolink';
import { text } from './source/text';
import { char } from './source/char';

export import InlineParser = MarkdownParser.InlineParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import AuthorityParser = InlineParser.AuthorityParser;
export import ExtensionParser = InlineParser.ExtensionParser;
export import LinkParser = InlineParser.LinkParser;
export import RubyParser = InlineParser.RubyParser;
export import HTMLParser = InlineParser.HTMLParser;
export import CommentParser = InlineParser.CommentParser;
export import EmphasisParser = InlineParser.EmphasisParser;
export import StrongParser = InlineParser.StrongParser;
export import CodeParser = InlineParser.CodeParser;
export import MathParser = InlineParser.MathParser;
export import MediaParser = InlineParser.MediaParser;
export import BracketParser = InlineParser.BracketParser;
export import HTMLEntityParser = InlineParser.HTMLEntityParser;
export import AutolinkParser = InlineParser.AutolinkParser;

export const inline: InlineParser = union<InlineParser>([
  inits([annotation, some(char('#'))]) as any as AnnotationParser,
  inits([authority, some(char('#'))]) as any as AuthorityParser,
  extension,
  link,
  ruby,
  html,
  comment,
  emphasis,
  strong,
  code,
  math,
  media,
  bracket,
  htmlentity,
  autolink,
  text
]);

export { index } from './inline/extension/index';
export { label, isGroup, isFixed } from './inline/extension/label';
export { link } from './inline/link';
export { media } from './inline/media';
export { uri } from './inline/autolink/uri';
