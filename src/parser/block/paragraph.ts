import { ParagraphParser } from '../block';
import { subsequence, some, block, rewrite, convert, trim, fmap } from '../../combinator';
import { defrag } from '../util';
import { mention } from './paragraph/mention';
import { inline } from '../inline';
import { anyline } from '../source';
import { html, define } from 'typed-dom';
import { push } from 'spica/array';

export const blankline = /^(?:\\?\s)*\\?(?:\n|$)/gm;

export const paragraph: ParagraphParser = block(fmap(
  convert(source => source.replace(blankline, ''),
  some(subsequence([
    fmap(
      some(mention),
      es => es.reduce((acc, el) => push(acc, [el, html('br')]), [])),
    fmap(
      rewrite(
        some(anyline, '>'),
        trim(some(inline))),
      ns => push(ns, [html('br')])),
  ]))),
  ns =>
    ns.length > 0
      ? [format(defrag(html('p', ns)))].map(el =>
          isVisible(el)
            ? el
            : define(el, {
                class: 'invalid',
                'data-invalid-syntax': 'paragraph',
                'data-invalid-message': 'All paragraphs must have a visible content',
              }))
      : []));

function format<T extends Node>(node: T): T {
  assert(node.lastChild instanceof HTMLBRElement);
  void node.lastChild?.remove();
  assert(node.lastChild instanceof HTMLBRElement === false);
  return node;
}

function isVisible(node: HTMLElement): boolean {
  return node.textContent!.trim() !== ''
      || node.getElementsByClassName('media').length > 0;
}
