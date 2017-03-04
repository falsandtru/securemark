import { MarkdownParser } from '../../markdown.d';
import { combine } from '../combinator/combine';
import { insertion } from './inline/insertion';
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
export import InsertionParser = InlineParser.InsertionParser;
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
  InsertionParser,
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
  insertion,
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

export function squash<N extends HTMLElement | Text>(nodes: N[]): DocumentFragment {
  const frag = document.createDocumentFragment();
  for (const curr of nodes) {
    const prev = frag.lastChild;
    if (prev && prev.nodeType === 3 && curr.nodeType === 3) {
      prev.textContent += curr.textContent!;
      curr.textContent = '';
    }
    else {
      void frag.appendChild(curr);
    }
  }
  return frag;
}
