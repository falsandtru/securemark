import { BlockquoteParser } from '../block';
import { Recursion } from '../context';
import { union, some, creation, recursion, block, validate, rewrite, open, convert, lazy, fmap } from '../../combinator';
import { autolink } from '../autolink';
import { contentline } from '../source';
import { parse } from '../api/parse';
import { html, defrag } from 'typed-dom/dom';

export const segment: BlockquoteParser.SegmentParser = block(union([
  validate(/!?>+(?=[^\S\n]|\n[^\S\n]*\S)/y, some(contentline)),
]));

export const blockquote: BlockquoteParser = lazy(() => block(rewrite(segment, union([
  open(/(?=>)/y, source),
  open(/!(?=>)/y, markdown),
]))));

const opener = /(?=>>+(?:$|\s))/y;
const indent = block(open(opener, some(contentline, />(?:$|\s)/y)), false);
const unindent = (source: string) => source.replace(/(?<=^|\n)>(?:[^\S\n]|(?=>*(?:$|\s)))|\n$/g, '');

const source: BlockquoteParser.SourceParser = lazy(() => fmap(
  some(recursion(Recursion.blockquote, union([
    rewrite(
      indent,
      convert(unindent, source, false, true)),
    rewrite(
      some(contentline, opener),
      convert(unindent, fmap(autolink, ns => [html('pre', defrag(ns))]), false, true)),
  ]))),
  ns => [html('blockquote', ns)]));

const markdown: BlockquoteParser.MarkdownParser = lazy(() => fmap(
  some(recursion(Recursion.blockquote, union([
    rewrite(
      indent,
      convert(unindent, markdown, false, true)),
    creation(10,
    rewrite(
      some(contentline, opener),
      convert(unindent, ({ context }) => {
        const { source } = context;
        const references = html('ol', { class: 'references' });
        const document = parse(source, {
          id: '',
          notes: {
            references,
          },
        }, context);
        context.position = source.length;
        return [[html('section', [document, html('h2', 'References'), references])]];
      }, false, true))),
  ]))),
  ns => [html('blockquote', ns)]));
