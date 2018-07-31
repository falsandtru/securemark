import { MarkdownParser } from '../../markdown.d';
import { union } from '../combinator';
import { annotation } from './inline/annotation';
import { authority } from './inline/authority';
import { link } from './inline/link';
import { extension } from './inline/extension';
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

export import InlineParser = MarkdownParser.InlineParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import AuthorityParser = InlineParser.AuthorityParser;
export import LinkParser = InlineParser.LinkParser;
export import ExtensionParser = InlineParser.ExtensionParser;
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
  annotation,
  authority,
  extension,
  link,
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
export { label, isFixed } from './inline/extension/label';
export { link } from './inline/link';
export { media } from './inline/media';
export { uri } from './inline/autolink/uri';
