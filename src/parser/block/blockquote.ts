import { BlockquoteParser } from '../block';
import { Parser, union, some, fmap, surround, block, rewrite, convert, build } from '../../combinator';
import { contentline } from '../source/line';
import '../source/unescapable';
import { parse } from '../api/parse';
import { suppress } from '../util';
import { concat } from 'spica/concat';
import { html, text } from 'typed-dom';

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
        source =>
          unindent(
            source
              .replace(/\n$/, '')
              .replace(/ /g, String.fromCharCode(160))),
        source => [[html('p', format(source))], '']))
  ]))),
  ns => [html('blockquote', ns)]);

const mdquote: Parser<HTMLQuoteElement, any> = fmap(build(() =>
  some(union([
    rewrite(
      indent,
      convert(unindent, mdquote)),
    rewrite(
      some(contentline, opener),
      convert(unindent, source => [[parse(source)], ''])),
  ]))),
  ns => [html('blockquote', ns)]);

const indent = block(surround(opener, some(contentline, /^>(?:\s|$)/), ''), false);

function unindent(source: string): string {
  return source.replace(/^>(?:$|\s)|^>(?=>*(?:$|\s))/mg, '');
}

function format(source: string): Node[] {
  return source.split('\n')
    .reduce((acc, source) =>
      concat(acc, [html('br'), text(source)])
      , [])
    .slice(1);
}
