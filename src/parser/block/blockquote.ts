﻿import { BlockquoteParser } from '../block';
import { Parser, union, some, fmap, surround, block, rewrite, convert, build } from '../../combinator';
import { contentline } from '../source/line';
import { autolink } from '../autolink';
import { parse } from '../api/parse';
import { suppress } from '../util';
import { html } from 'typed-dom';

export const blockquote: BlockquoteParser = block(build(() => union([
  surround(/^(?=>+(?:[^\S\n]|\n[^\S\n]*\S))/, textquote, ''),
  surround(/^!(?=>+(?:[^\S\n]|\n[^\S\n]*\S))/, suppress(mdquote), ''),
])));

const opener = /^(?=>>+(?:\s|$))/;

const textquote: Parser<HTMLQuoteElement, any> = fmap(build(() =>
  some(union([
    rewrite(
      indent,
      convert(unindent, textquote)),
    rewrite(
      some(contentline, opener),
      convert(
        unindent,
        fmap(some(autolink), ns => [html('pre', ns)]))),
  ]))),
  ns => [html('blockquote', ns)]);

const mdquote: Parser<HTMLQuoteElement, any> = fmap(build(() =>
  some(union([
    rewrite(
      indent,
      convert(unindent, mdquote)),
    rewrite(
      some(contentline, opener),
      convert(
        unindent,
        source => [[parse(source)], ''])),
  ]))),
  ns => [html('blockquote', ns)]);

const indent = block(surround(opener, some(contentline, /^>(?:\s|$)/), ''), false);

function unindent(source: string): string {
  return source
    .replace(/\n$/, '')
    .replace(/^>(?:$|\s|(?=>*(?:$|\s)))/mg, '');
}
