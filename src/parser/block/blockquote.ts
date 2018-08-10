import { BlockquoteParser } from '../block';
import { Parser, union, some, surround, block, line, focus, fmap, build } from '../../combinator';
import { contentline } from '../source/line';
import '../source/unescapable';
import { parse } from '../api/parse';
import { suppress } from '../../util/suppression';
import { concat } from 'spica/concat';
import { html, text } from 'typed-dom';

export const blockquote: BlockquoteParser = block(build(() => union([
  surround(/^(?=>+(?:[^\S\n]|\n[^\S\n]*\S))/, textquote, ''),
  surround(/^!(?=>+(?:[^\S\n]|\n[^\S\n]*\S))/, fmap(mdquote, es => void es.forEach(suppress) || es), ''),
])));

const opener = /^(?=>>+(?:\s|$))/;

const textquote: Parser<HTMLQuoteElement, any> = fmap(build(() =>
  some(union([
    focus(
      indent,
      s => textquote(unindent(s))),
    fmap(
      some(line(focus(contentline, s => [[s.split('\n')[0]], ''])), opener),
      ss =>
        unindent(ss.join('\n'))
          .replace(/ /g, String.fromCharCode(160))
          .split('\n')
          .reduce((acc, s) =>
            concat(acc, [html('br'), text(s)])
          , [])
          .slice(1))
  ]))),
  ns => [html('blockquote', ns)]);

const mdquote: Parser<HTMLQuoteElement, any> = fmap(build(() =>
  some(union([
    focus(
      indent,
      s => mdquote(unindent(s))),
    focus(
      some(line(focus(contentline, s => [[s], ''])), opener),
      s => [[parse(unindent(s))], '']),
  ]))),
  ns => [html('blockquote', ns)]);

const indent = block(surround(opener, some(line(focus(contentline, s => [[s], ''])), /^>(?:\s|$)/), ''), false);

function unindent(source: string): string {
  return source.replace(/^>(?:$|\s)|^>(?=>*(?:$|\s))/mg, '');
}
