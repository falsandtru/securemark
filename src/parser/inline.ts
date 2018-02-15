import { MarkdownParser } from '../../markdown.d';
import { combine } from '../combinator';
import { brace } from './inline/brace';
import { annotation } from './inline/annotation';
import { parenthesis } from './inline/parenthesis';
import { link } from './inline/link';
import { extension } from './inline/extension';
import { bracket } from './inline/bracket';
import { html } from './inline/html';
import { anglebracket } from './inline/anglebracket';
import { emphasis } from './inline/emphasis';
import { strong } from './inline/strong';
import { code } from './inline/code';
import { math } from './inline/math';
import { media } from './inline/media';
import { htmlentity } from './inline/htmlentity';
import { autolink } from './inline/autolink';
import { text } from './source/text';

export import InlineParser = MarkdownParser.InlineParser;
export import BraceParser = InlineParser.BraceParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import ParenthesisParser = InlineParser.ParenthesisParser;
export import LinkParser = InlineParser.LinkParser;
export import ExtensionParser = InlineParser.ExtensionParser;
export import BracketParser = InlineParser.BracketParser;
export import HTMLParser = InlineParser.HTMLParser;
export import AngleBracketParser = InlineParser.AngleBracketParser;
export import EmphasisParser = InlineParser.EmphasisParser;
export import StrongParser = InlineParser.StrongParser;
export import CodeParser = InlineParser.CodeParser;
export import MathParser = InlineParser.MathParser;
export import MediaParser = InlineParser.MediaParser;
export import HTMLEntityParser = InlineParser.HTMLEntityParser;
export import AutolinkParser = InlineParser.AutolinkParser;

export const inline: InlineParser = combine<InlineParser>([
  brace,
  annotation,
  parenthesis,
  link,
  extension,
  bracket,
  html,
  anglebracket,
  emphasis,
  strong,
  code,
  math,
  media,
  htmlentity,
  autolink,
  text
]);
