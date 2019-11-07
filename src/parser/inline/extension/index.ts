import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, rewrite, verify, surround, convert, lazy, fmap } from '../../../combinator';
import { link } from '../link';
import { configure } from '../../../combinator';
import { indexee } from './indexee';
import { trimNodeEnd, hasTightText } from '../../util';
import { define } from 'typed-dom';

export const index: ExtensionParser.IndexParser = lazy(() => subline(fmap(indexee(verify(trimNodeEnd(
  configure({ syntax: { inline: { link: undefined, media: false } } },
  surround(
    '[#',
    rewrite(
      verify(some(inline, /^\\?\n|^]/), (_, rest) => rest.startsWith(']')),
      convert(
        query => `[${query}]{#}`,
        union([link]))),
    ']'))),
  ([el]) => hasTightText(el))),
  ([el]) => [define(el, { id: null, class: 'index', href: `#${el.id}` })])));
