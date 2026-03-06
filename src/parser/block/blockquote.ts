import { BlockquoteParser } from '../block';
import { Recursion } from '../context';
import { List, Data } from '../../combinator/data/parser';
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
const indent = block(open(opener, some(contentline, />(?:$|[ \n])/y)), false);
const unindent = (source: string) => source.replace(/(?<=^|\n)>(?: |(?=>*(?:$|[ \n])))|\n$/g, '');

const source: BlockquoteParser.SourceParser = lazy(() => fmap(
  some(recursion(Recursion.blockquote, union([
    rewrite(
      indent,
      convert(unindent, source, false, true)),
    rewrite(
      some(contentline, opener),
      convert(unindent, fmap(autolink, ns => new List([new Data(html('pre', defrag(unwrap(ns))))])), false, true)),
  ]))),
  ns => new List([new Data(html('blockquote', unwrap(ns)))])));

const markdown: BlockquoteParser.MarkdownParser = lazy(() => fmap(
  some(recursion(Recursion.blockquote, union([
    rewrite(
      indent,
      convert(unindent, markdown, false, true)),
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
        return new List([new Data(html('section', [document, html('h2', 'References'), references]))]);
      }, false, true)),
  ]))),
  ns => new List([new Data(html('blockquote', unwrap(ns)))])));
