import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, rewrite, surround, convert, configure, lazy, fmap } from '../../../combinator';
import { link } from '../link';
import { indexee } from './indexee';
import { define } from 'typed-dom';

export const index: ExtensionParser.IndexParser = lazy(() => subline(fmap(
  configure({ syntax: { inline: { link: undefined, media: false } } },
  rewrite(
    surround('[#', some(inline, /^\\?\n|^]/), ']'),
    convert(
      query => `[${query.slice(2, -1)}]{#}`,
      indexee(union([link]))))),
  ([el]) => [define(el, { id: null, class: 'index', href: `#${el.id}` })])));
