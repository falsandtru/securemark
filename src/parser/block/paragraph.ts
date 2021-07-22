import { ParagraphParser } from '../block';
import { subsequence, some, block, trim, fmap } from '../../combinator';
import { mention } from './paragraph/mention';
import { inline } from '../inline';
import { localize } from '../locale';
import { visualize } from '../util';
import { html, defrag } from 'typed-dom';
import { push, pop } from 'spica/array';

export const paragraph: ParagraphParser = block(localize(fmap(
  subsequence([
    fmap(
      some(mention),
      es => es.reduce((acc, el) => push(acc, [el, html('br')]), [])),
    fmap(
      visualize(trim(some(inline))),
      ns => push(ns, [html('br')])),
  ]),
  ns => [html('p', defrag(pop(ns)[0]))])));
