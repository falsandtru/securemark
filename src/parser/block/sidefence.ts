import { SidefenceParser } from '../block';
import { union, some, creation, block, focus, rewrite, convert, lazy, fmap } from '../../combinator';
import { autolink } from '../autolink';
import { contentline } from '../source';
import { html, define, defrag } from 'typed-dom/dom';

export const sidefence: SidefenceParser = lazy(() => block(fmap(focus(
  /^(?=\|+(?:[^\S\n]|\n\|))(?:\|+(?:[^\S\n][^\n]*)?(?:$|\n))+$/,
  union([source])),
  ([el]) => [
    define(el, {
      class: 'invalid',
      'data-invalid-syntax': 'sidefence',
      'data-invalid-type': 'syntax',
      'data-invalid-message': 'Reserved syntax',
    }),
  ])));

const opener = /^(?=\|\|+(?:$|\s))/;
const unindent = (source: string) => source.replace(/(^|\n)\|(?:[^\S\n]|(?=\|*(?:$|\s)))|\n$/g, '$1');

const source: SidefenceParser.SourceParser = lazy(() => fmap(
  some(creation(union([
    focus(
      /^(?:\|\|+(?:[^\S\n][^\n]*)?(?:$|\n))+/,
      convert(unindent, source)),
    rewrite(
      some(contentline, opener),
      convert(unindent, fmap(some(autolink), ns => [html('pre', defrag(ns))]))),
  ]))),
  ns => [html('blockquote', ns)]));
