import { ParagraphParser } from '../block';
import { subsequence, some, block, rewrite, convert, trim, fmap } from '../../combinator';
import { defrag } from '../util';
import { mention } from './paragraph/mention';
import { syntax as delimiter } from './paragraph/mention/quotation';
import { inline } from '../inline';
import { anyline } from '../source';
import { html, define } from 'typed-dom';
import { pop, push } from 'spica/array';

export const blankline = /^(?:\\?\s)*\\?(?:\n|$)/gm;

export const paragraph: ParagraphParser = block(fmap(
  convert(source => source.replace(blankline, ''),
  some(subsequence([
    fmap(
      some(mention),
      es => es.reduce((acc, el) => push(acc, [el, html('br')]), [])),
    fmap(
      rewrite(
        some(anyline, delimiter),
        trim(some(inline))),
      ns => push(ns, [html('br')])),
  ]))),
  ns => {
    if (ns.length === 0) return [];
    const el = html('p', defrag(pop(ns)[0]));
    return [
      isVisible(el)
        ? el
        : define(el, {
            class: 'invalid',
            'data-invalid-syntax': 'paragraph',
            'data-invalid-type': 'visibility',
            'data-invalid-description': 'Paragraphs must have a visible content.',
          })
    ];
  }));

function isVisible(node: HTMLElement): boolean {
  return node.innerText.trimStart() !== ''
      || node.getElementsByClassName('media').length > 0;
}
