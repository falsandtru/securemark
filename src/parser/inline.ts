import { MarkdownParser } from '../../markdown';
import { union, lazy } from '../combinator';
import { annotation } from './inline/annotation';
import { reference } from './inline/reference';
import { template } from './inline/template';
import { remark } from './inline/remark';
import { extension } from './inline/extension';
import { textlink } from './inline/link';
import { ruby } from './inline/ruby';
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
import { text, strs } from './source';

export import InlineParser = MarkdownParser.InlineParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import ReferenceParser = InlineParser.ReferenceParser;
export import TemplateParser = InlineParser.TemplateParser;
export import RemarkParser = InlineParser.RemarkParser;
export import ExtensionParser = InlineParser.ExtensionParser;
export import LinkParser = InlineParser.LinkParser;
export import RubyParser = InlineParser.RubyParser;
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

const stars = strs('*');

export const inline: InlineParser = lazy(() => union([
  input => {
    const { context: { source, position } } = input;
    if (position === source.length) return;
    switch (source[position]) {
      case '(':
        if (source[position + 1] === '(') return annotation(input) || bracket(input);
        return bracket(input);
      case '[':
        switch (source[position + 1]) {
          case '[':
            return reference(input)
                || textlink(input)
                || bracket(input);
          case '%':
            return remark(input)
                || textlink(input)
                || ruby(input)
                || bracket(input);
          case '#':
          case '$':
          case ':':
          case '^':
          case '|':
            return extension(input)
                || textlink(input)
                || ruby(input)
                || bracket(input);
        }
        return textlink(input)
            || ruby(input)
            || bracket(input);
      case '{':
        if (source[position + 1] === '{') return template(input) || bracket(input);
        return textlink(input)
            || bracket(input);
      case '"':
      case '（':
      case '［':
      case '｛':
        return bracket(input);
      case '<':
        return html(input);
      case '$':
        if (source[position + 1] === '{') return math(input);
        return extension(input)
            || math(input);
      case '+':
        if (source[position + 1] === '+') return insertion(input);
        break;
      case '~':
        if (source[position + 1] === '~') return deletion(input);
        break;
      case '=':
        if (source[position + 1] === '=') return mark(input);
        break;
      case '/':
        if (source[position + 1] === '/' && source[position + 2] === '/') return italic(input);
        break;
      case '*':
        return source[position + 1] === '*'
          ? source[position + 2] === '*'
            ? emstrong(input) || stars(input)
            : strong(input) || stars(input)
          : emphasis(input);
      case '`':
        return code(input);
      case '&':
        return htmlentity(input);
    }
  },
  autolink,
  text
])) as any;

export { indexee } from './inline/extension/indexee';
export { indexer } from './inline/extension/indexer';
export { dataindex } from './inline/extension/index';
export { medialink } from './inline/link';
export { media } from './inline/media';
export { shortmedia, lineshortmedia } from './inline/shortmedia';
