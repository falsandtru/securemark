import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, rewrite, verify, surround, convert, lazy, fmap } from '../../../combinator';
import { link } from '../link';
import { indexee } from './indexer';
import { trimNodeEnd, hasTightText, hasMedia } from '../../util';
import { define } from 'typed-dom';

export const index: ExtensionParser.IndexParser = lazy(() => subline(fmap(indexee(verify(trimNodeEnd(
  surround(
    '[#',
    rewrite(
      verify(some(inline, /^\\?\n|^]/), (_, rest) => rest.startsWith(']')),
      convert(
        query => `[${query}]{#}`,
        union([link]))),
    ']')),
  ([el]) => hasTightText(el) && !hasMedia(el))),
  ([el]) => [define(el, { id: null, class: 'index', href: `#${el.id}` })])));
