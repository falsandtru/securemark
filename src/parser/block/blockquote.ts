import { BlockquoteParser } from '../block';
import { Recursion } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, spend, recursion, block, validate, rewrite, open, convert, lazy, fmap } from '../../combinator';
import { autolink } from '../autolink';
import { contentline } from '../source';
import { unwrap, randomID } from '../util';
import { parse } from '../../api/parse';
import { html, defrag } from 'typed-dom/dom';

export const segment: BlockquoteParser.SegmentParser = block(union([
  validate(/!?>+ /y, some(contentline)),
]));

export const blockquote: BlockquoteParser = lazy(() => block(rewrite(segment, union([
  open(/(?=>)/y, source),
  open(/!(?=>)/y, markdown),
]))));

const opener = /(?=>>+(?:$|[ \r\n]))/y;
const indent = open(opener, some(contentline, />(?:$|[ \r\n])/y));
const unindent = (source: string) => source.replace(/(?<=^|\n)>(?: |(?=>*(?:$|[ \r\n])))|\r?\n$/g, '');

const source: BlockquoteParser.SourceParser = lazy(() => fmap(
  recursion(Recursion.blockquote, some(union([
    rewrite(
      indent,
      convert(unindent, source)),
    rewrite(
      some(contentline, opener),
      convert(unindent, fmap(autolink, ns => new List([new Node(html('pre', defrag(unwrap(ns))))])))),
  ]))),
  ns => new List([new Node(html('blockquote', unwrap(ns)))])));

const markdown: BlockquoteParser.MarkdownParser = lazy(() => fmap(
  recursion(Recursion.blockquote, some(union([
    rewrite(
      indent,
      convert(unindent, markdown)),
    rewrite(
      some(contentline, opener),
      convert(unindent, context => {
        spend(context, 10);
        const { source } = context;
        const references = html('ol', { class: 'references' });
        const document = parse(source, {
          local: true,
          id: context.id === '' ? '' : randomID(),
          notes: {
            references,
          },
        }, context);
        context.position = source.length;
        return new List([new Node(html('section', [document, html('h2', 'References'), references]))]);
      })),
  ]))),
  ns => new List([new Node(html('blockquote', unwrap(ns)))])));
