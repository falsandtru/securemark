import { MarkdownParser } from '../../markdown';
import { union, lazy } from '../combinator';
import { annotation } from './inline/annotation';
import { reference } from './inline/reference';
import { template } from './inline/template';
import { remark } from './inline/remark';
import { math } from './inline/math';
import { extension } from './inline/extension';
import { ruby } from './inline/ruby';
import { textlink, linemedialink } from './inline/link';
import { html } from './inline/html';
import { insertion } from './inline/insertion';
import { deletion } from './inline/deletion';
import { mark } from './inline/mark';
import { emphasis } from './inline/emphasis';
import { strong } from './inline/strong';
import { code } from './inline/code';
import { linemedia } from './inline/media';
import { htmlentity } from './inline/htmlentity';
import { lineshortmedia } from './inline/shortmedia';
import { autolink } from './inline/autolink';
import { bracket } from './inline/bracket';
import { text } from './source';

export import InlineParser = MarkdownParser.InlineParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import ReferenceParser = InlineParser.ReferenceParser;
export import TemplateParser = InlineParser.TemplateParser;
export import RemarkParser = InlineParser.RemarkParser;
export import MathParser = InlineParser.MathParser;
export import ExtensionParser = InlineParser.ExtensionParser;
export import RubyParser = InlineParser.RubyParser;
export import LinkParser = InlineParser.LinkParser;
export import HTMLParser = InlineParser.HTMLParser;
export import InsertionParser = InlineParser.InsertionParser;
export import DeletionParser = InlineParser.DeletionParser;
export import MarkParser = InlineParser.MarkParser;
export import EmphasisParser = InlineParser.EmphasisParser;
export import StrongParser = InlineParser.StrongParser;
export import CodeParser = InlineParser.CodeParser;
export import MediaParser = InlineParser.MediaParser;
export import HTMLEntityParser = InlineParser.HTMLEntityParser;
export import UnsafeHTMLEntityParser = InlineParser.UnsafeHTMLEntityParser;
export import ShortMediaParser = InlineParser.ShortMediaParser;
export import AutolinkParser = InlineParser.AutolinkParser;
export import BracketParser = InlineParser.BracketParser;

export const inline: InlineParser = lazy(() => union([
  annotation,
  reference,
  template,
  remark,
  math,
  extension,
  ruby,
  textlink,
  linemedialink,
  linemedia,
  html,
  insertion,
  deletion,
  mark,
  strong,
  emphasis,
  code,
  htmlentity,
  lineshortmedia,
  autolink,
  bracket,
  text
]));

export { indexee } from './inline/extension/indexee';
export { indexer } from './inline/extension/indexer';
export { media } from './inline/media';
export { shortmedia } from './inline/shortmedia';
