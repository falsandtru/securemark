import { BlockquoteParser } from '../block';
import { Input, Recursion } from '../context';
import { Parser, List, Node } from '../../combinator/parser';
import { union, some, always, force, recursion, scope, block, validate, rewrite, open, lazy, fmap } from '../../combinator';
import { document } from '../document';
import { autolink } from '../autolink';
import { contentline } from '../source';
import { unwrap } from '../util';
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
const unindent = ({ source }: Input) => source.replace(/(?<=^|\n)>(?: |(?=>*(?:$|[ \r\n])))|\r?\n$/g, '');

const source: BlockquoteParser.SourceParser = lazy(() => fmap(
  recursion(Recursion.block, some(union([
    rewrite(
      indent,
      scope(unindent, source, false)),
    rewrite(
      some(contentline, opener),
      scope(unindent, force(fmap(autolink, ns => new List([new Node(html('pre', defrag(unwrap(ns))))]))), false)),
  ]))),
  ns => new List([new Node(html('blockquote', unwrap(ns)))])));

const markdown: BlockquoteParser.MarkdownParser = lazy(() => fmap(
  recursion(Recursion.block, some(union([
    rewrite(
      indent,
      scope(unindent, markdown, false)),
    rewrite(
      some(contentline, opener),
      scope(unindent, always<Parser<HTMLElement | DocumentFragment, Input>>([
        (input, output) => {
          input.header = true;
          input.local = true;
          input.notes = {
            references: html('ol', { class: 'references' }),
          };
          output.push();
          return output.context;
        },
        document,
        ({ notes }, output) => {
          const doc = output.pop().head!.value;
          if (!doc.firstChild) return output.context;
          return output.append(new Node(html('section', [
            // DocumentFragmentを追加すると異常に重くなるので避ける
            ...doc.children,
            html('h2', 'References'),
            notes!.references,
          ])));
        },
      ]), true)),
  ]))),
  ns => new List([new Node(html('blockquote', unwrap(ns)))])));
