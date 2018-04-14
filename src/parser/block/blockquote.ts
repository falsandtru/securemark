import { BlockquoteParser } from '../block';
import { Parser, union, some, match, surround, transform, rewrite, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { parse } from '../parse';
import { squash } from '../util';
import { concat } from 'spica/concat';
import { html, text } from 'typed-dom';

const syntax = /^!?(?=(>+)\s)/;

export const blockquote: BlockquoteParser = block(match(syntax, ([flag], source) =>
  flag
    ? parseMarkdown(source)
    : parseText(source)));

const parseText: Parser<HTMLQuoteElement, Parser<HTMLElement | Text, any>[]> = transform(build(() =>
  some(union([
    rewrite(indent, s => parseText(unindent(s))),
    line(s => [[text(unindent(s.split('\n')[0])), html('br')], ''], true, true),
  ]))),
  (ns, rest) => {
    return [[html('blockquote', clean(ns))], rest];

    function clean(ns: Node[]): Node[] {
      return ns
        .filter((n, i) => !(
          n instanceof HTMLBRElement &&
          (i === ns.length - 1 || ns[i + 1] instanceof HTMLQuoteElement)))
        .map(n =>
          n instanceof Text
            ? text(n.textContent!.replace(/ /g, String.fromCharCode(160)))
            : n);
    }
  });

const parseMarkdown: Parser<HTMLQuoteElement, Parser<HTMLQuoteElement | Text, any>[]> = transform(build(() =>
  some(union([
    rewrite(indent, s => parseMarkdown(unindent(s))),
    line(s => [[text(unindent(s))], ''], true, true),
  ]))),
  (ns, rest) => {
    return [[html('blockquote', render(ns))], rest];

    function render(ns: Node[]): Node[] {
      return squash(ns)
        .reduce<Node[]>((ns, node) =>
          node instanceof Text
            ? concat(ns, [...parse(node.textContent!).childNodes])
            : concat(ns, [node])
          , []);
    }
  });

const indent = block(surround(
  /^(?=>>+(?:\s|$))/,
  some(line(s => [[s], ''], true, true), /^>(?:\s|$)/),
  ''
), false);

function unindent(source: string): string {
  return source.replace(/^>(?:$|\s)|^>(?=>*(?:$|\s))/mg, '');
}
