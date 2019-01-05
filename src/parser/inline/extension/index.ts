import { ExtensionParser, inline } from '../../inline';
import { union, some, fmap, surround, verify, subline, rewrite, convert, lazy } from '../../../combinator';
import { link } from '../link';
import { defineIndex } from '../../block/indexer';
import { startsWithTightText, hasMedia } from '../../util';
import { define } from 'typed-dom';

export const index: ExtensionParser.IndexParser = subline(verify(
  fmap(lazy(() =>
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
  ([el]) => startsWithTightText(el) && !hasMedia(el)));
