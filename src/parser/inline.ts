import { MarkdownParser } from '../../markdown.d';
import { combine } from '../combinator/combine';
import { deletion } from './inline/deletion';
import { strong } from './inline/strong';
import { emphasis } from './inline/emphasis';
import { superscript } from './inline/superscript';
import { subscript } from './inline/subscript';
import { code } from './inline/code';
import { image } from './inline/image';
import { link } from './inline/link';
import { annotation } from './inline/annotation';
import { html } from './inline/html';
import { text } from './inline/text';

export import InlineParser = MarkdownParser.InlineParser;
export import DeletionParser = InlineParser.DeletionParser;
export import StrongParser = InlineParser.StrongParser;
export import EmphasisParser = InlineParser.EmphasisParser;
export import SuperScriptParser = InlineParser.SuperScriptParser;
export import SubScriptParser = InlineParser.SubScriptParser;
export import CodeParser = InlineParser.CodeParser;
export import ImageParser = InlineParser.ImageParser;
export import LinkParser = InlineParser.LinkParser;
export import AnnotationParser = InlineParser.AnnotationParser;
export import HTMLParser = InlineParser.HTMLParser;
export import TextParser = InlineParser.TextParser;
export import PlainTextParser = InlineParser.PlainTextParser;

export const inline: InlineParser = combine<[
  DeletionParser,
  StrongParser,
  EmphasisParser,
  SuperScriptParser,
  SubScriptParser,
  CodeParser,
  ImageParser,
  LinkParser,
  AnnotationParser,
  HTMLParser,
  TextParser
], HTMLElement | Text>([
  deletion,
  strong,
  emphasis,
  superscript,
  subscript,
  code,
  image,
  link,
  annotation,
  html,
  text
]);
