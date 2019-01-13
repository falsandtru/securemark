﻿import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, rewrite, verify, surround, convert, lazy, fmap } from '../../../combinator';
import { link } from '../link';
import { index as idx } from './indexer';
import { trimNodeEnd, hasTightText, hasMedia } from '../../util';
import { define } from 'typed-dom';

export const index: ExtensionParser.IndexParser = lazy(() => subline(fmap(idx(verify(trimNodeEnd(
  surround(
    '[#',
    rewrite(
      some(inline, /^[\n\]]/),
      convert(
        query => `[${query}]{#}`,
        union([link]))),
    ']')),
  ([el]) => hasTightText(el) && !hasMedia(el))),
  ([el]) => [define(el, { id: undefined, href: `#${el.id}` })])));
