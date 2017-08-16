import { MarkdownParser } from '../../markdown.d';
import { combine } from '../combinator/combine';
import { annotation } from './inline/annotation';
import { parenthesis } from './inline/parenthesis';
import { strong } from './inline/strong';
import { emphasis } from './inline/emphasis';
import { code } from './inline/code';
import { math } from './inline/math';
import { media } from './inline/media';
import { link } from './inline/link';
import { extension } from './inline/extension';
import { html } from './inline/html';
import { htmlentity } from './inline/htmlentity';
import { autolink } from './inline/autolink';
import { TextParser } from './source';
import { text } from './source/text';

export import InlineParser = MarkdownParser.InlineParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import ParenthesisParser = InlineParser.ParenthesisParser;
export import StrongParser = InlineParser.StrongParser;
export import EmphasisParser = InlineParser.EmphasisParser;
export import CodeParser = InlineParser.CodeParser;
export import MathInlineParser = InlineParser.MathInlineParser;
export import MediaParser = InlineParser.MediaParser;
export import LinkParser = InlineParser.LinkParser;
export import ExtensionParser = InlineParser.ExtensionParser;
export import HTMLParser = InlineParser.HTMLParser;
export import HTMLEntityParser = InlineParser.HTMLEntityParser;
export import AutolinkParser = InlineParser.AutolinkParser;

export const inline: InlineParser = combine<[
  AnnotationParser,
  ParenthesisParser,
  StrongParser,
  EmphasisParser,
  CodeParser,
  MathInlineParser,
  MediaParser,
  LinkParser,
  ExtensionParser,
  HTMLParser,
  HTMLEntityParser,
  AutolinkParser,
  TextParser
], HTMLElement | Text>([
  annotation,
  parenthesis,
  strong,
  emphasis,
  code,
  math,
  media,
  link,
  extension,
  html,
  htmlentity,
  autolink,
  text
]);
