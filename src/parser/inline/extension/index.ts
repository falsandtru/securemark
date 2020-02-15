import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, creator, backtracker, surround, update, lazy, fmap } from '../../../combinator';
import { indexee } from './indexee';
import { str } from '../../source';
import { defrag, startTight } from '../../util';
import { html, define } from 'typed-dom';

export const index: ExtensionParser.IndexParser = lazy(() => creator(fmap<HTMLAnchorElement, ExtensionParser.IndexParser>(indexee(fmap(surround(
  '[#',
  subline(
  update({ syntax: { inline: {
    link: false,
    media: false,
    annotation: false,
    reference: false,
    extension: false,
    autolink: false,
  }}},
  startTight(union([some(inline, ']')])))),
  backtracker(str(']'))),
  ns => [html('a', defrag(ns))])),
  ([el]) => [define(el, { id: null, class: 'index', href: el.id ? `#${el.id}` : void 0 }, el.childNodes)])));
