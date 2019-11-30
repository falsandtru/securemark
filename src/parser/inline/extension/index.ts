import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, rewrite, verify, surround, convert, configure, lazy, fmap } from '../../../combinator';
import { link } from '../link';
import { indexee } from './indexee';
import { trimNodeEnd, hasTightText } from '../../util';
import { define } from 'typed-dom';

export const index: ExtensionParser.IndexParser = lazy(() => subline(fmap(indexee(verify(trimNodeEnd(
  configure({ syntax: { inline: { link: undefined, media: false } } },
  surround(
    '[#',
    rewrite(
      some(inline, /^\\?\n|^]/),
      convert(
        query => `[${query}]{#}`,
        union([link]))),
    ']'))),
  ([el]) => hasTightText(el))),
  ([el]) => [define(el, { id: null, class: 'index', href: `#${el.id}` })])));
