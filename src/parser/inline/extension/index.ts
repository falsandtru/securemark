import { undefined } from 'spica/global';
import { ExtensionParser } from '../../inline';
import { union, some, validate, guard, context, precedence, creator, surround, open, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { indexee, identity } from './indexee';
import { txt, str, stropt } from '../../source';
import { startTight, trimBlankEnd } from '../../util';
import { html, define, defrag } from 'typed-dom/dom';

import IndexParser = ExtensionParser.IndexParser;

export const index: IndexParser = lazy(() => creator(precedence(3, validate('[#', fmap(indexee(surround(
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
  open(stropt(/^\|?/), trimBlankEnd(some(union([
    signature,
    inline,
  ]), ']', [[/^\\?\n/, 9], [']', 3]])), true)))),
  ']',
  false,
  ([, ns], rest) => [[html('a', defrag(ns))], rest])),
  ([el]: [HTMLAnchorElement]) => [
    define(el,
      {
        id: el.id ? null : undefined,
        class: 'index',
        href: el.id ? `#${el.id}` : undefined,
      },
      el.childNodes),
  ])))));

const signature: IndexParser.SignatureParser = lazy(() => creator(fmap(open(
  '|#',
  startTight(some(union([bracket, txt]), ']'))),
  ns => [
    html('span', { class: 'indexer', 'data-index': identity(ns.join('')).slice(6) }),
  ])));

const bracket: IndexParser.SignatureParser.BracketParser = lazy(() => creator(union([
  surround(str('('), some(union([bracket, txt]), ')'), str(')'), true),
  surround(str('['), some(union([bracket, txt]), ']'), str(']'), true),
  surround(str('{'), some(union([bracket, txt]), '}'), str('}'), true),
  surround(str('"'), precedence(8, some(txt, '"')), str('"'), true),
])));
