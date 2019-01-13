import { BlockquoteParser } from '../block';
import { union, some, block, rewrite, surround, convert, lazy, fmap } from '../../combinator';
import { contentline } from '../source/line';
import { autolink } from '../autolink';
import { parse } from '../api/parse';
import { defrag, suppress } from '../util';
import { html } from 'typed-dom';

export const blockquote: BlockquoteParser = lazy(() => block(union([
  surround(/^(?=>+(?:[^\S\n]|\n.*?\S))/, textquote, ''),
  surround(/^!(?=>+(?:[^\S\n]|\n.*?\S))/, sourcequote, ''),
])));

const opener = /^(?=>>+(?:\s|$))/;

const textquote: BlockquoteParser.TextquoteParser = lazy(() => fmap(
  some(union([
    rewrite(
      indent,
      convert(unindent, textquote)),
    rewrite(
      some(contentline, opener),
      convert(unindent, fmap(defrag(some(autolink)), ns => [html('pre', ns)]))),
  ])),
  ns => [html('blockquote', ns)]));

const sourcequote: BlockquoteParser.SourcequoteParser = lazy(() => fmap(
  some(union([
    rewrite(
      indent,
      convert(unindent, sourcequote)),
    rewrite(
      some(contentline, opener),
      convert(unindent, source => [[suppress(parse(source))], ''])),
  ])),
  ns => [html('blockquote', ns)]));

const indent = block(surround(opener, some(contentline, /^>(?:\s|$)/), ''), false);

function unindent(source: string): string {
  return source
    .replace(/\n$/, '')
    .replace(/^>(?:$|\s|(?=>+(?:$|\s)))/mg, '');
}
