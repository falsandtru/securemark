import { ReplyParser } from '../block';
import { inits, subsequence, some, block, validate, rewrite, trim, fmap } from '../../combinator';
import { cite } from './reply/cite';
import { quote, syntax as delimiter } from './reply/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { localize } from '../locale';
import { visualize } from '../util';
import { html, defrag } from 'typed-dom';
import { push, pop } from 'spica/array';

export const reply: ReplyParser = block(validate('>', localize(fmap(
  inits([
    some(inits([
      cite,
      quote,
    ])),
    some(subsequence([
      some(quote),
      fmap(
        rewrite(
          some(anyline, delimiter),
          trim(visualize(some(inline)))),
        ns => push(ns, [html('br')])),
    ])),
  ]),
  ns => [html('p', defrag(pop(ns)[0]))]))));
