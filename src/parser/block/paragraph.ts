import { ParagraphParser } from '../block';
import { subsequence, some, block, rewrite, trim, fmap } from '../../combinator';
import { justify, defrag } from '../util';
import { mention } from './paragraph/mention';
import { syntax as delimiter } from './paragraph/mention/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { pop, push } from 'spica/array';
import { html, define } from 'typed-dom';

export const paragraph: ParagraphParser = block(justify(fmap(
  some(subsequence([
    fmap(
      some(mention),
      es => es.reduce((acc, el) => push(acc, [el, html('br')]), [])),
    fmap(
      rewrite(
        some(anyline, delimiter),
        trim(some(inline))),
      ns => push(ns, [html('br')])),
  ])),
  ns => {
    assert(ns.length > 0);
    const el = html('p', defrag(pop(ns)[0]));
    return [
      isVisible(el)
        ? el
        : define(el, {
            class: 'invalid',
            'data-invalid-syntax': 'paragraph',
            'data-invalid-type': 'content',
            'data-invalid-description': 'Paragraphs must have a visible content.',
          })
    ];
  })));

function isVisible(node: HTMLElement): boolean {
  return node.innerText.trimStart() !== ''
      || node.getElementsByClassName('media').length > 0;
}
