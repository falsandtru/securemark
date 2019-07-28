import { ParagraphParser } from '../block';
import { subsequence, some, block, rewrite, trim, fmap } from '../../combinator';
import { mention } from './paragraph/mention';
import { inline } from '../inline';
import { contentline } from '../source';
import { defrag, hasContent } from '../util';
import { html } from 'typed-dom';

export const paragraph: ParagraphParser = block(fmap(
  some(subsequence([
    some(mention),
    rewrite(
      some(contentline, /^>/),
      defrag(trim(some(inline)))),
  ])),
  ns => [html('p', ns)].filter(hasContent)));
