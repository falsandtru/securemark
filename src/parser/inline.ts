import { MarkdownParser } from '../../markdown.d';
import { union } from '../combinator';
import { annotation } from './inline/annotation';
import { reference } from './inline/reference';
import { template } from './inline/template';
import { extension } from './inline/extension';
import { link } from './inline/link';
import { ruby } from './inline/ruby';
import { html } from './inline/html';
import { comment } from './inline/comment';
import { insertion } from './inline/insertion';
import { deletion } from './inline/deletion';
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

export import Config = MarkdownParser.Config;
export import InlineParser = MarkdownParser.InlineParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import ReferenceParser = InlineParser.ReferenceParser;
export import TemplateParser = InlineParser.TemplateParser;
export import ExtensionParser = InlineParser.ExtensionParser;
export import LinkParser = InlineParser.LinkParser;
export import RubyParser = InlineParser.RubyParser;
export import HTMLParser = InlineParser.HTMLParser;
export import CommentParser = InlineParser.CommentParser;
export import InsertionParser = InlineParser.InsertionParser;
export import DeletionParser = InlineParser.DeletionParser;
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
  annotation,
  reference,
  template,
  extension,
  link,
  media,
  ruby,
  html,
  comment,
  insertion,
  deletion,
  emphasis,
  strong,
  code,
  math,
  htmlentity,
  shortmedia,
  autolink,
  bracket,
  text
]);

export { link } from './inline/link';
export { media } from './inline/media';
export { shortmedia } from './inline/shortmedia';
export { autolink } from './inline/autolink';
export { uri, address, attribute } from './inline/autolink/uri';
export { indexer, indexee } from './inline/extension/indexer';
export { label, isFixed, isFormatted } from './inline/extension/label';
