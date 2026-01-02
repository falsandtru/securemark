import { BlockquoteParser } from '../block';
import { union, some, creation, block, validate, rewrite, open, convert, lazy, fmap } from '../../combinator';
import { autolink } from '../autolink';
import { contentline } from '../source';
import { Recursion } from '../context';
import { parse } from '../api/parse';
import { html, defrag } from 'typed-dom/dom';

export const segment: BlockquoteParser.SegmentParser = block(validate(['!>', '>'], union([
  validate(/^!?>+(?=[^\S\n]|\n[^\S\n]*\S)/, some(contentline)),
])));

export const blockquote: BlockquoteParser = lazy(() => block(rewrite(segment, union([
  open(/^(?=>)/, source),
  open(/^!(?=>)/, markdown),
]))));

const opener = /^(?=>>+(?:$|\s))/;
const indent = block(open(opener, some(contentline, /^>(?:$|\s)/)), false);
const unindent = (source: string) => source.replace(/(?<=^|\n)>(?:[^\S\n]|(?=>*(?:$|\s)))|\n$/g, '');

const source: BlockquoteParser.SourceParser = lazy(() => fmap(
  some(creation(0, Recursion.blockquote, union([
    rewrite(
      indent,
      convert(unindent, source, true)),
    rewrite(
      some(contentline, opener),
      convert(unindent, fmap(autolink, ns => [html('pre', defrag(ns))]), true)),
  ]))),
  ns => [html('blockquote', ns)]));

const markdown: BlockquoteParser.MarkdownParser = lazy(() => fmap(
  some(creation(0, Recursion.blockquote, union([
    rewrite(
      indent,
      convert(unindent, markdown, true)),
    creation(10, Recursion.ignore,
    rewrite(
      some(contentline, opener),
      convert(unindent, ({ source, context }) => {
        const references = html('ol', { class: 'references' });
        const document = parse(source, {
          id: '',
          notes: {
            references,
          },
        }, context);
        return [[html('section', [document, html('h2', 'References'), references])], ''];
      }, true))),
  ]))),
  ns => [html('blockquote', ns)]));
