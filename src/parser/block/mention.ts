import { MentionParser } from '../block';
import { inits, subsequence, some, block, validate, rewrite, trim, fmap } from '../../combinator';
import { cite } from './mention/cite';
import { quote, syntax as delimiter } from './mention/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { localize } from '../locale';
import { visualize } from '../util';
import { html, defrag } from 'typed-dom';
import { push, pop } from 'spica/array';

export const mention: MentionParser = block(validate('>', localize(fmap(
  some(inits([
    some(inits([
      cite,
      quote,
    ])),
    subsequence([
      some(quote),
      fmap(
        rewrite(
          some(anyline, delimiter),
          trim(visualize(some(inline)))),
        ns => push(ns, [html('br')])),
    ]),
  ])),
  ns => [html('p', defrag(pop(ns)[0]))]))));
