import { ParagraphParser } from '../block';
import { subsequence, some, block, rewrite, trim, fmap } from '../../combinator';
import { localize } from '../locale';
import { visualize, defrag } from '../util';
import { mention } from './paragraph/mention';
import { syntax as delimiter } from './paragraph/mention/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { push, pop } from 'spica/array';
import { html } from 'typed-dom';

export const paragraph: ParagraphParser = block(localize(fmap(
  some(subsequence([
    fmap(
      some(mention),
      es => es.reduce((acc, el) => push(acc, [el, html('br')]), [])),
    fmap(
      rewrite(
        some(anyline, delimiter),
        visualize(trim(some(inline)))),
      ns => push(ns, [html('br')])),
  ])),
  ns => [html('p', defrag(pop(ns)[0]))])));
