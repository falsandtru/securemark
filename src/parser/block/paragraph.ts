import { ParagraphParser } from '../block';
import { subsequence, some, block, rewrite, convert, trim, fmap } from '../../combinator';
import { mention } from './paragraph/mention';
import { inline } from '../inline';
import { contentline } from '../source';
import { defrag, isVisible } from '../util';
import { concat } from 'spica/concat';
import { html, define } from 'typed-dom';

const blankline = /^(?:\\?\s)*\\?(?:\n|$)/gm;

export const paragraph: ParagraphParser = block(fmap(convert(
  source => source.replace(blankline, ''),
  some(subsequence([
    fmap(
      some(mention),
      es => es.reduce((acc, el) => concat(acc, [el, html('br')]), [])),
    fmap(
      rewrite(
        some(contentline, '>'),
        defrag(trim(some(inline)))),
      ns => concat(ns, [html('br')])),
  ]))),
  ns =>
    ns.length > 0
      ? [html('p', format(ns))].map(el =>
          isVisible(el)
            ? el
            : define(el, {
                class: 'invalid',
                'data-invalid-syntax': 'paragraph',
                'data-invalid-type': 'visibility',
              }))
      : []));

function format<T extends Node[]>(ns: T): T {
  assert(ns.length > 1);
  assert(ns[ns.length - 1] instanceof HTMLBRElement);
  void ns.pop();
  assert(ns.length > 0);
  assert(ns[ns.length - 1] instanceof HTMLBRElement === false);
  return ns;
}
