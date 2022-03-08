import { ParagraphParser } from '../block';
import { union, inits, some, block, rewrite, trim, fmap } from '../../combinator';
import { mention } from './paragraph/mention';
import { quote, syntax as delimiter } from './paragraph/mention/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { localize } from '../locale';
import { visualize } from '../util';
import { html, define, defrag } from 'typed-dom';
import { push, pop } from 'spica/array';

export const paragraph: ParagraphParser = block(localize(fmap(
  union([
    inits([
      some(mention),
      some(union([
        quote,
        fmap(
          rewrite(
            some(anyline, delimiter),
            trim(visualize(some(inline)))),
          ns => push(ns, [html('br')])),
      ])),
    ]),
    some(union([
      fmap(
        quote,
        ([el, br]: HTMLElement[]) => [define(el, {
          class: 'quote invalid',
          'data-invalid-syntax': 'quote',
          'data-invalid-type': 'location',
          'data-invalid-description': 'Need a cite at the first line of the paragraph.',
        }), br]),
      fmap(
        rewrite(
          some(anyline, delimiter),
          trim(visualize(some(inline)))),
        ns => push(ns, [html('br')])),
    ])),
  ]),
  ns => [html('p', defrag(pop(ns)[0]))])));
