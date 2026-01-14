import { MarkdownParser } from '../../markdown';
import { union, lazy } from '../combinator';
import { annotation } from './inline/annotation';
import { reference } from './inline/reference';
import { template } from './inline/template';
import { remark } from './inline/remark';
import { extension } from './inline/extension';
import { ruby } from './inline/ruby';
import { textlink } from './inline/link';
import { html } from './inline/html';
import { insertion } from './inline/insertion';
import { deletion } from './inline/deletion';
import { mark } from './inline/mark';
import { emstrong } from './inline/emstrong';
import { strong } from './inline/strong';
import { emphasis } from './inline/emphasis';
import { italic } from './inline/italic';
import { math } from './inline/math';
import { code } from './inline/code';
import { htmlentity } from './inline/htmlentity';
import { bracket } from './inline/bracket';
import { autolink } from './inline/autolink';
import { text } from './source';

export import InlineParser = MarkdownParser.InlineParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import ReferenceParser = InlineParser.ReferenceParser;
export import TemplateParser = InlineParser.TemplateParser;
export import RemarkParser = InlineParser.RemarkParser;
export import ExtensionParser = InlineParser.ExtensionParser;
export import RubyParser = InlineParser.RubyParser;
export import LinkParser = InlineParser.LinkParser;
export import HTMLParser = InlineParser.HTMLParser;
export import InsertionParser = InlineParser.InsertionParser;
export import DeletionParser = InlineParser.DeletionParser;
export import MarkParser = InlineParser.MarkParser;
export import EmStrongParser = InlineParser.EmStrongParser;
export import StrongParser = InlineParser.StrongParser;
export import EmphasisParser = InlineParser.EmphasisParser;
export import ItalicParser = InlineParser.ItalicParser;
export import MathParser = InlineParser.MathParser;
export import CodeParser = InlineParser.CodeParser;
export import MediaParser = InlineParser.MediaParser;
export import HTMLEntityParser = InlineParser.HTMLEntityParser;
export import UnsafeHTMLEntityParser = InlineParser.UnsafeHTMLEntityParser;
export import ShortMediaParser = InlineParser.ShortMediaParser;
export import BracketParser = InlineParser.BracketParser;
export import AutolinkParser = InlineParser.AutolinkParser;

export const inline: InlineParser = lazy(() => union([
  input => {
    const { source } = input;
    if (source === '') return;
    switch (source.slice(0, 2)) {
      case '((':
        return annotation(input);
      case '[[':
        return reference(input)
            || textlink(input);
      case '{{':
        return template(input);
      case '[%':
        return remark(input)
            || textlink(input);
      case '[#':
      case '[$':
      case '[:':
      case '[^':
      case '[|':
        return extension(input)
            || textlink(input);
      case '${':
        return math(input);
      case '++':
        return insertion(input);
      case '~~':
        return deletion(input);
      case '==':
        return mark(input);
      case '//':
        return italic(input);
    }
    switch (source[0]) {
      case '[':
        return ruby(input)
            || textlink(input);
      case '{':
        return textlink(input);
      case '<':
        return html(input);
      case '$':
        return extension(input)
            || math(input);
      case '`':
        return code(input);
      case '*':
        return emstrong(input)
            || strong(input)
            || emphasis(input);
      case '&':
        return htmlentity(input);
    }
  },
  bracket,
  autolink,
  text
])) as any;

export { indexee } from './inline/extension/indexee';
export { indexer } from './inline/extension/indexer';
export { dataindex } from './inline/extension/index';
export { medialink } from './inline/link';
export { media } from './inline/media';
export { shortmedia } from './inline/shortmedia';
