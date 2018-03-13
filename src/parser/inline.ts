import { MarkdownParser } from '../../markdown.d';
import { combine } from '../combinator';
import { comment } from './inline/comment';
import { annotation } from './inline/annotation';
import { link } from './inline/link';
import { extension } from './inline/extension';
import { html } from './inline/html';
import { emphasis } from './inline/emphasis';
import { strong } from './inline/strong';
import { code } from './inline/code';
import { math } from './inline/math';
import { media } from './inline/media';
import { bracket } from './inline/bracket';
import { htmlentity } from './inline/htmlentity';
import { autolink } from './inline/autolink';
import { text } from './source/text';

export import InlineParser = MarkdownParser.InlineParser;
export import CommentParser = InlineParser.CommentParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import LinkParser = InlineParser.LinkParser;
export import ExtensionParser = InlineParser.ExtensionParser;
export import HTMLParser = InlineParser.HTMLParser;
export import EmphasisParser = InlineParser.EmphasisParser;
export import StrongParser = InlineParser.StrongParser;
export import CodeParser = InlineParser.CodeParser;
export import MathParser = InlineParser.MathParser;
export import MediaParser = InlineParser.MediaParser;
export import BracketParser = InlineParser.BracketParser;
export import HTMLEntityParser = InlineParser.HTMLEntityParser;
export import AutolinkParser = InlineParser.AutolinkParser;

export const inline: InlineParser = combine<InlineParser>([
  comment,
  annotation,
  link,
  extension,
  html,
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
export { label } from './inline/extension/label';
export { media } from './inline/media';
export { url } from './inline/autolink/url';
export { hasContent } from './inline/util/verification';
