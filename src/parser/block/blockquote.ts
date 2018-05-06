﻿import { BlockquoteParser } from '../block';
import { Parser, union, some, surround, fmap, rewrite, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { parse } from '../parse';
import { html, text } from 'typed-dom';

export const blockquote: BlockquoteParser = block(build(() => union([
  surround(/^(?=(>+)\s)/, textquote, ''),
  surround(/^!(?=(>+)\s)/, mdquote, ''),
])));

const opener = /^(?=>>+(?:\s|$))/;

const textquote: Parser<HTMLQuoteElement, any> = fmap(build(() =>
  some(union([
    fmap(
      some(line(s => [[text(unindent(s.split('\n')[0].replace(/ /g, String.fromCharCode(160)))), html('br')], ''], true, true), opener),
      ns => ns.slice(0, -1)),
    rewrite(indent, s => textquote(unindent(s))),
  ]))),
  ns =>
    [html('blockquote', ns)]);

const mdquote: Parser<HTMLQuoteElement, any> = fmap(build(() =>
  some(union([
    rewrite(
      some(line(s => [[s], ''], true, true), opener),
      s => [[parse(unindent(s))], '']),
    rewrite(indent, s => mdquote(unindent(s))),
  ]))),
  ns =>
    [html('blockquote', ns)]);

const indent = block(surround(opener, some(line(s => [[s], ''], true, true), /^>(?:\s|$)/), ''), false);

function unindent(source: string): string {
  return source.replace(/^>(?:$|\s)|^>(?=>*(?:$|\s))/mg, '');
}
