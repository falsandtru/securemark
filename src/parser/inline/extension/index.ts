import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, creator, surround, context, lazy, fmap } from '../../../combinator';
import { startTight, isTight, trimEnd, defrag } from '../../util';
import { indexee } from './indexee';
import { html, define } from 'typed-dom';

export const index: ExtensionParser.IndexParser = lazy(() => creator(fmap(indexee(surround(
  '[#',
  subline(
  context({ syntax: { inline: {
    link: false,
    media: false,
    annotation: false,
    reference: false,
    extension: false,
    autolink: false,
  }}},
  startTight(union([some(inline, ']')])))),
  ']', false,
  ([, bs], rest) =>
    isTight(bs, 0, bs.length)
      ? [[defrag(html('a', trimEnd(bs)))], rest]
      : void 0)),
  ([el]: [HTMLAnchorElement]) =>
    [define(el, { id: null, class: 'index', href: el.id ? `#${el.id}` : void 0 }, el.childNodes)])));
