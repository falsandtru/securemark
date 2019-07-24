import { ParagraphParser } from '../block';
import { subsequence, some, block, rewrite, trim, fmap } from '../../combinator';
import { mention } from './paragraph/mention';
import { inline } from '../inline';
import { contentline } from '../source/line';
import { defrag, hasContent } from '../util';
import { html } from 'typed-dom';

export const paragraph: ParagraphParser = block(fmap(
  some(subsequence([
    some(mention),
    rewrite(
      some(contentline, /^>/),
      defrag(trim(some(inline)))),
  ])),
  ns => [
    html('p', ns.reduceRight(
      (acc, node) => {
        node.nodeType === 1 && (node as Element).matches('.address, .quote')
          ? void acc.unshift(node, html('br'))
          : void acc.unshift(node);
        return acc;
      },
      ns.length === 0 ? [] : [ns.pop()!]))
  ].filter(hasContent)));
