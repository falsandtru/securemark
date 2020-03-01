import { BlockquoteParser } from '../block';
import { union, some, block, validate, rewrite, creator, fmap, open, convert, lazy } from '../../combinator';
import { defrag, suppress } from '../util';
import { contentline } from '../source';
import { autolink } from '../autolink';
import { parse } from '../api/parse';
import { html } from 'typed-dom';

export const segment: BlockquoteParser.SegmentParser = block(validate(['!', '>'], union([
  validate(/^!?>+(?=[^\S\n]|\n\s*\S)/, some(contentline)),
])));

export const blockquote: BlockquoteParser = lazy(() => block(creator(10, rewrite(segment, union([
  open(/^(?=>)/, text),
  open(/^!(?=>)/, source),
])))));

const opener = /^(?=>>+(?:$|\s))/;

const indent = block(open(opener, some(contentline, /^>(?:$|\s)/)), false);

function unindent(source: string): string {
  return source
    .replace(/\n$/, '')
    .replace(/^>(?:$|\s|(?=>+(?:$|\s)))/mg, '');
}

const text: BlockquoteParser.TextParser = lazy(() => fmap(
  some(union([
    rewrite(
      indent,
      convert(unindent, text)),
    rewrite(
      some(contentline, opener),
      convert(unindent, fmap(some(autolink), ns => [html('pre', defrag(ns))]))),
  ])),
  ns => [html('blockquote', ns)]));

const source: BlockquoteParser.SourceParser = lazy(() => fmap(
  some(union([
    rewrite(
      indent,
      convert(unindent, source)),
    rewrite(
      some(contentline, opener),
      convert(unindent, (source, context) => [[suppress(parse(source, { context, footnotes: { annotation: html('ol'), reference: html('ol') } }))], ''])),
  ])),
  ns => [html('blockquote', ns)]));
