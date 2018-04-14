import { BlockquoteParser } from '../block';
import { Parser, union, some, surround, transform, rewrite, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { parse } from '../parse';
import { squash } from '../util';
import { concat } from 'spica/concat';
import { html, text } from 'typed-dom';

export const blockquote: BlockquoteParser = block(build(() => union([
  surround(/^(?=(>+)\s)/, textquote, ''),
  surround(/^!(?=(>+)\s)/, mdquote, ''),
])));

const textquote: Parser<HTMLQuoteElement, any> = transform(build(() =>
  some(union([
    rewrite(indent, s => textquote(unindent(s))),
    line(s => [[text(unindent(s.split('\n')[0])), html('br')], ''], true, true),
  ]))),
  (ns, rest) => {
    return [[html('blockquote', adjust(ns))], rest];

    function adjust(ns: Node[]): Node[] {
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

const mdquote: Parser<HTMLQuoteElement, any> = transform(build(() =>
  some(union([
    rewrite(indent, s => mdquote(unindent(s))),
    line(s => [[text(unindent(s))], ''], true, true),
  ]))),
  (ns, rest) => {
    return [[html('blockquote', expand(ns))], rest];

    function expand(ns: Node[]): Node[] {
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
