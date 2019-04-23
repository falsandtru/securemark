import { ParagraphParser } from '../block';
import { subsequence, some, block, trim, fmap } from '../../combinator';
import { mention } from './paragraph/mention';
import { inline } from '../inline';
import { defrag, hasContent } from '../util';
import { html } from 'typed-dom';

export const paragraph: ParagraphParser = block(fmap(
  subsequence([
    some(mention),
    defrag(trim(some(inline))),
  ]),
  ns => [html('p', ns)].filter(hasContent)));
