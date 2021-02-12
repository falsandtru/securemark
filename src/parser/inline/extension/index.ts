import { undefined } from 'spica/global';
import { ExtensionParser } from '../../inline';
import { union, inits, some, validate, verify, guard, context, creator, surround, open, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { indexee, identify } from './indexee';
import { txt, str } from '../../source';
import { startTight, isEndTight } from '../../util';
import { html, define, defrag } from 'typed-dom';
import { join } from 'spica/array';

import IndexParser = ExtensionParser.IndexParser;

export const index: IndexParser = lazy(() => creator(validate('[#', ']', '\n', fmap(indexee(fmap(verify(surround(
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
  inits([
    some(inline, /^]|^\|#(?!]|\\?\s)/, /^\\?\n/),
    indexer,
  ])))),
  ']'),
  isEndTight),
  ns => [html('a', defrag(ns))])),
  ([el]: [HTMLAnchorElement]) => [
    define(el,
      { id: el.id ? null : undefined, class: 'index', href: el.id ? `#${el.id}` : undefined },
      el.childNodes),
  ]))));

const indexer: IndexParser.IndexerParser = lazy(() => creator(fmap(verify(open(
  '|#',
  some(union([bracket, txt]), ']', /^\\?\n/)),
  isEndTight),
  ns => [
    html('span', { class: 'indexer', 'data-index': identify(join(ns).trim()).slice(6) }),
  ])));

const bracket: IndexParser.IndexerParser.BracketParser = lazy(() => creator(union([
  surround(str('('), some(union([bracket, txt]), ')'), str(')'), true),
  surround(str('['), some(union([bracket, txt]), ']'), str(']'), true),
  surround(str('{'), some(union([bracket, txt]), '}'), str('}'), true),
  surround(str('"'), some(txt, '"'), str('"'), true),
])));
