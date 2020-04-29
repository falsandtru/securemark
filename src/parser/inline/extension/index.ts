import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, validate, context, creator, fmap, surround, lazy } from '../../../combinator';
import { startTight, isTight, trimEnd, defrag } from '../../util';
import { indexee } from './indexee';
import { html, define } from 'typed-dom';

export const index: ExtensionParser.IndexParser = lazy(() => creator(fmap(indexee(surround(
  '[#',
  validate(/^[^\n\]]+\]/,
  startTight(
  context({ syntax: { inline: {
    link: false,
    media: false,
    annotation: false,
    reference: false,
    extension: false,
    autolink: false,
  }}},
  subline(union([some(inline, ']')]))))),
  ']', false,
  ([, bs], rest) =>
    isTight(bs, 0, bs.length)
      ? [[html('a', defrag(trimEnd(bs)))], rest]
      : void 0)),
  ([el]: [HTMLAnchorElement]) =>
    [define(el, { id: null, class: 'index', href: el.id ? `#${el.id}` : void 0 }, el.childNodes)])));
