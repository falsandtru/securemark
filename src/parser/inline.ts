import { MarkdownParser } from '../../markdown.d';
import { union } from '../combinator';
import { escape } from './inline/escape';
import { annotation } from './inline/annotation';
import { reference } from './inline/reference';
import { template } from './inline/template';
import { extension } from './inline/extension';
import { ruby } from './inline/ruby';
import { link } from './inline/link';
import { html } from './inline/html';
import { comment } from './inline/comment';
import { insertion } from './inline/insertion';
import { deletion } from './inline/deletion';
import { mark } from './inline/mark';
import { emstrong } from './inline/emstrong';
import { emphasis } from './inline/emphasis';
import { strong } from './inline/strong';
import { code } from './inline/code';
import { math } from './inline/math';
import { media } from './inline/media';
import { htmlentity } from './inline/htmlentity';
import { shortmedia } from './inline/shortmedia';
import { autolink } from './inline/autolink';
import { bracket } from './inline/bracket';
import { text } from './source';

export import InlineParser = MarkdownParser.InlineParser;
export import EscapeParser = InlineParser.EscapeParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import ReferenceParser = InlineParser.ReferenceParser;
export import TemplateParser = InlineParser.TemplateParser;
export import ExtensionParser = InlineParser.ExtensionParser;
export import RubyParser = InlineParser.RubyParser;
export import LinkParser = InlineParser.LinkParser;
export import HTMLParser = InlineParser.HTMLParser;
export import CommentParser = InlineParser.CommentParser;
export import InsertionParser = InlineParser.InsertionParser;
export import DeletionParser = InlineParser.DeletionParser;
export import MarkParser = InlineParser.MarkParser;
export import EmStrongParser = InlineParser.EmStrongParser;
export import EmphasisParser = InlineParser.EmphasisParser;
export import StrongParser = InlineParser.StrongParser;
export import CodeParser = InlineParser.CodeParser;
export import MathParser = InlineParser.MathParser;
export import MediaParser = InlineParser.MediaParser;
export import HTMLEntityParser = InlineParser.HTMLEntityParser;
export import ShortmediaParser = InlineParser.ShortmediaParser;
export import AutolinkParser = InlineParser.AutolinkParser;
export import BracketParser = InlineParser.BracketParser;

export const inline: InlineParser = union([
  escape,
  annotation,
  reference,
  template,
  extension,
  ruby,
  link,
  media,
  html,
  comment,
  insertion,
  deletion,
  mark,
  emstrong,
  strong,
  emphasis,
  code,
  math,
  htmlentity,
  shortmedia,
  autolink,
  bracket,
  text
]);

export { htmlentity } from './inline/htmlentity';
export { comment } from './inline/comment';
export { link } from './inline/link';
export { media } from './inline/media';
export { shortmedia } from './inline/shortmedia';
export { autolink } from './inline/autolink';
export { url } from './inline/autolink/url';
export { address } from './inline/autolink/address';
export { indexer } from './inline/extension/indexer';
export { indexee } from './inline/extension/indexee';
export { isFixed, isFormatted } from './inline/extension/label';
