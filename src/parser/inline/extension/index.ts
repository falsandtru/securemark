import { undefined } from 'spica/global';
import { ExtensionParser, inline } from '../../inline';
import { union, some, validate, guard, context, creator, surround, lazy, fmap } from '../../../combinator';
import { indexee } from './indexee';
import { startTight, isEndTight } from '../../util';
import { html, define, defrag } from 'typed-dom';

export const index: ExtensionParser.IndexParser = lazy(() => creator(validate('[#', ']', '\n', fmap(indexee(surround(
  '[#',
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
  union([some(inline, ']', /^\\?\n/)])))),
  ']', false,
  ([, bs], rest) =>
    isEndTight(bs)
      ? [[html('a', defrag(bs))], rest]
      : undefined)),
  ([el]: [HTMLAnchorElement]) =>
    [define(el, { id: el.id ? null : undefined, class: 'index', href: el.id ? `#${el.id}` : undefined }, el.childNodes)]))));
