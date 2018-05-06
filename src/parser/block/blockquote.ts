import { BlockquoteParser } from '../block';
import { Parser, union, some, surround, transform, rewrite, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { parse } from '../parse';
import { html, text } from 'typed-dom';

export const blockquote: BlockquoteParser = block(build(() => union([
  surround(/^(?=(>+)\s)/, textquote, ''),
  surround(/^!(?=(>+)\s)/, mdquote, ''),
])));

const opener = /^(?=>>+(?:\s|$))/;

const textquote: Parser<HTMLQuoteElement, any> = transform(build(() =>
  some(union([
    transform(
      some(line(s => [[text(unindent(s.split('\n')[0].replace(/ /g, String.fromCharCode(160)))), html('br')], ''], true, true), opener),
      (ns, rest) =>
        [ns.slice(0, -1), rest]),
    rewrite(indent, s => textquote(unindent(s))),
  ]))),
  (ns, rest) =>
    [[html('blockquote', ns)], rest]);

const mdquote: Parser<HTMLQuoteElement, any> = transform(build(() =>
  some(union([
    rewrite(
      some(line(s => [[s], ''], true, true), opener),
      s => [[parse(unindent(s))], '']),
    rewrite(indent, s => mdquote(unindent(s))),
  ]))),
  (ns, rest) =>
    [[html('blockquote', ns)], rest]);

const indent = block(surround(opener, some(line(s => [[s], ''], true, true), /^>(?:\s|$)/), ''), false);

function unindent(source: string): string {
  return source.replace(/^>(?:$|\s)|^>(?=>*(?:$|\s))/mg, '');
}
