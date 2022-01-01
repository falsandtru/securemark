import { ParagraphParser } from '../block';
import { union, subsequence, some, block, rewrite, trim, fmap } from '../../combinator';
import { mention } from './paragraph/mention';
import { quote, syntax as delimiter } from './paragraph/mention/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { localize } from '../locale';
import { visualize } from '../util';
import { html, defrag } from 'typed-dom';
import { push, pop } from 'spica/array';

export const paragraph: ParagraphParser = block(localize(fmap(
  subsequence([
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
  ns => [html('p', defrag(pop(ns)[0]))])));
