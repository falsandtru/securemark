import { BlockquoteParser } from '../block';
import { Recursion } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, consume, recursion, block, validate, rewrite, open, convert, lazy, fmap } from '../../combinator';
import { autolink } from '../autolink';
import { contentline } from '../source';
import { unwrap } from '../util';
import { parse } from '../api/parse';
import { html, defrag } from 'typed-dom/dom';

export const segment: BlockquoteParser.SegmentParser = block(union([
  validate(/!?>+ /y, some(contentline)),
]));

export const blockquote: BlockquoteParser = lazy(() => block(rewrite(segment, union([
  open(/(?=>)/y, source),
  open(/!(?=>)/y, markdown),
]))));

const opener = /(?=>>+(?:$|[ \n]))/y;
const indent = open(opener, some(contentline, />(?:$|[ \n])/y));
const unindent = (source: string) => source.replace(/(?<=^|\n)>(?: |(?=>*(?:$|[ \n])))|\n$/g, '');

const source: BlockquoteParser.SourceParser = lazy(() => fmap(
  recursion(Recursion.blockquote, some(union([
    rewrite(
      indent,
      convert(unindent, source, true)),
    rewrite(
      some(contentline, opener),
      convert(unindent, fmap(autolink, ns => new List([new Node(html('pre', defrag(unwrap(ns))))])), true)),
  ]))),
  ns => new List([new Node(html('blockquote', unwrap(ns)))])));

const markdown: BlockquoteParser.MarkdownParser = lazy(() => fmap(
  recursion(Recursion.blockquote, some(union([
    rewrite(
      indent,
      convert(unindent, markdown, true)),
    rewrite(
      some(contentline, opener),
      convert(unindent, ({ context }) => {
        consume(10, context);
        const { source } = context;
        const references = html('ol', { class: 'references' });
        const document = parse(source, {
          id: '',
          notes: {
            references,
          },
        }, context);
        context.position = source.length;
        return new List([new Node(html('section', [document, html('h2', 'References'), references]))]);
      }, true)),
  ]))),
  ns => new List([new Node(html('blockquote', unwrap(ns)))])));
