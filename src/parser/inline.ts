import { DocumentParser } from '../../markdown';
import { union, lazy } from '../combinator';
import { annotation } from './inline/annotation';
import { reference } from './inline/reference';
import { template } from './inline/template';
import { remark } from './inline/remark';
import { extension } from './inline/extension';
import { label } from './inline/extension/label';
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

export import InlineParser = DocumentParser.InlineParser;
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

const p1 = lazy(() => union([
  annotation,
  bracket,
]));
const p2 = lazy(() => union([
  reference,
  textlink,
  bracket,
]));
const p3 = lazy(() => union([
  remark,
  textlink,
  ruby,
  bracket,
]));
const p4 = lazy(() => union([
  extension,
  textlink,
  ruby,
  bracket,
]));
const p5 = lazy(() => union([
  textlink,
  ruby,
  bracket,
]));
const p6 = lazy(() => union([
  template,
  bracket,
]));
const p7 = lazy(() => union([
  textlink,
  bracket,
]));
const p8 = lazy(() => union([
  label,
  math,
]));
const p9 = lazy(() => union([
  emstrong,
  stars,
]));
const p10 = lazy(() => union([
  strong,
  stars,
]));
export const inline: InlineParser = lazy(() => union([
  (input, output) => {
    const { source, position } = input;
    if (position === source.length) return;
    switch (source[position]) {
      case '(':
        if (source[position + 1] === '(') return p1(input, output);
        return bracket(input, output);
      case '[':
        switch (source[position + 1]) {
          case '[':
            return p2(input, output);
          case '%':
            return p3(input, output);
          case '#':
          case '$':
          case ':':
          case '^':
          case '|':
            return p4(input, output);
        }
        return p5(input, output);
      case '{':
        if (source[position + 1] === '{') return p6(input, output);
        return p7(input, output);
      case '"':
      case '（':
      case '［':
      case '｛':
        return bracket(input, output);
      case '<':
        if (isAlphabet(source[position + 1])) return html(input, output);
        break;
      case '$':
        if (source[position + 1] === '{') return math(input, output);
        return p8(input, output);
      case '+':
        if (source[position + 1] === '+') return insertion(input, output);
        break;
      case '~':
        if (source[position + 1] === '~') return deletion(input, output);
        break;
      case '=':
        if (source[position + 1] === '=') return mark(input, output);
        break;
      case '/':
        if (source[position + 1] === '/' && source[position + 2] === '/') return italic(input, output);
        break;
      case '*':
        return source[position + 1] === '*'
          ? source[position + 2] === '*'
            ? p9(input, output)
            : p10(input, output)
          : emphasis(input, output);
      case '`':
        return code(input, output);
      case '&':
        return htmlentity(input, output);
    }
  },
  autolink,
  text
]));

export { indexee } from './inline/extension/indexee';
export { indexer } from './inline/extension/indexer';
export { dataindex } from './inline/extension/index';
export { medialink } from './inline/link';
export { media } from './inline/media';
export { shortmedia, lineshortmedia } from './inline/shortmedia';

function isAlphabet(char: string): boolean {
  assert(char.length === 1);
  return char <= 'z' && 'a' <= char;
}
