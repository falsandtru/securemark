import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, validate, guard, context, creator, fmap, surround, lazy } from '../../../combinator';
import { startTight, isEndTight, trimEnd, defrag } from '../../util';
import { indexee } from './indexee';
import { html, define } from 'typed-dom';

export const index: ExtensionParser.IndexParser = lazy(() => creator(fmap(indexee(surround(
  '[#',
  validate(/^[^\n\]]+\]/,
  guard(context => context.syntax?.inline?.index ?? true,
  startTight(
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    index: false,
    label: false,
    link: false,
    media: false,
    autolink: false,
  }}},
  subline(union([some(inline, ']')])))))),
  ']', false,
  ([, bs], rest) =>
    isEndTight(bs)
      ? [[html('a', defrag(trimEnd(bs)))], rest]
      : void 0)),
  ([el]: [HTMLAnchorElement]) =>
    [define(el, { id: null, class: 'index', href: el.id ? `#${el.id}` : void 0 }, el.childNodes)])));
