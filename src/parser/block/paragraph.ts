import { ParagraphParser } from '../block';
import { subsequence, some, block, rewrite, trim, fmap } from '../../combinator';
import { mention } from './paragraph/mention';
import { inline } from '../inline';
import { contentline } from '../source';
import { defrag, hasContent } from '../util';
import { concat } from 'spica/concat';
import { html, define } from 'typed-dom';

export const paragraph: ParagraphParser = block(fmap(
  some(subsequence([
    fmap(
      some(mention),
      es => es.reduce((acc, el) => concat(acc, [el, html('br')]), [])),
    fmap(
      rewrite(
        some(contentline, '>'),
        defrag(trim(some(inline)))),
      ns => concat(ns, [html('br')])),
  ])),
  ns => [html('p', format(ns))].map(el =>
    hasContent(el)
      ? el
      : define(el, {
          class: 'invalid',
          'data-invalid-syntax': 'paragraph',
          'data-invalid-type': 'visibility',
        }))));

function format<T extends Node[]>(ns: T): T {
  ns[ns.length - 1] instanceof HTMLBRElement && void ns.pop();
  assert(!(ns[0] instanceof HTMLBRElement));
  assert(!(ns[ns.length - 1] instanceof HTMLBRElement));
  return ns;
}
