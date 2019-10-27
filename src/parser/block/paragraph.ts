import { ParagraphParser } from '../block';
import { subsequence, some, block, rewrite, trim, lazy, fmap } from '../../combinator';
import { mention } from './paragraph/mention';
import { inline } from '../inline';
import { contentline } from '../source';
import { defrag, hasContent } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

export const paragraph: ParagraphParser = lazy(() => block(fmap(
  some(subsequence([
    fmap(
      some(mention),
      es => es.reduce((acc, el) => concat(acc, [el, html('br')]), [])),
    fmap(
      content,
      ns => concat(ns, [html('br')])),
  ])),
  ns => [html('p', format(ns))].filter(hasContent))));

const content = block(rewrite(
  some(contentline, /^>/),
  defrag(trim(some(inline)))),
  false);

function format<T extends Node[]>(ns: T): T {
  ns[ns.length - 1] instanceof HTMLBRElement && void ns.pop();
  assert(!(ns[0] instanceof HTMLBRElement));
  assert(!(ns[ns.length - 1] instanceof HTMLBRElement));
  return ns;
}
