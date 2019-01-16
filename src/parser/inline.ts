import { MarkdownParser } from '../../markdown.d';
import { union } from '../combinator';
import { annotation } from './inline/annotation';
import { authority } from './inline/authority';
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
import { bracket } from './inline/bracket';
import { htmlentity } from './inline/htmlentity';
import { shortmedia } from './inline/shortmedia';
import { autolink } from './inline/autolink';
import { text } from './source/text';

export import InlineParser = MarkdownParser.InlineParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import AuthorityParser = InlineParser.AuthorityParser;
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
export import BracketParser = InlineParser.BracketParser;
export import HTMLEntityParser = InlineParser.HTMLEntityParser;
export import ShortmediaParser = InlineParser.ShortmediaParser;
export import AutolinkParser = InlineParser.AutolinkParser;

export const inline: InlineParser = union([
  annotation,
  authority,
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
  bracket,
  shortmedia,
  autolink,
  text
]);

export { indexer, index } from './inline/extension/indexer';
export { label, isGroup, isFixed } from './inline/extension/label';
export { link } from './inline/link';
export { media } from './inline/media';
export { uri } from './inline/autolink/uri';
export { shortmedia } from './inline/shortmedia';
