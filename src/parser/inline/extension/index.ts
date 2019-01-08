import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, rewrite, verify, surround, convert, lazy, fmap } from '../../../combinator';
import { link } from '../link';
import { defineIndex } from './indexer';
import { trimEdgeEnd, hasTightText, hasMedia } from '../../util';
import { define } from 'typed-dom';

export const index: ExtensionParser.IndexParser = lazy(() => subline(verify(fmap(trimEdgeEnd(
  surround(
    '[#',
    rewrite(
      some(inline, /^[\n\]]/),
      convert(
        query => `[${query}]{#}`,
        union([link]))),
    ']')),
  ([el]) => (
    void defineIndex(el),
    [define(el, { id: undefined, href: `#${el.id}` })])),
  ([el]) => hasTightText(el) && !hasMedia(el))));
