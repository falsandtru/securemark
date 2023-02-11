import { ExtensionParser } from '../../inline';
import { union, some, syntax, creation, precedence, constraint, validate, surround, open, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { indexee, identity } from './indexee';
import { txt, str, stropt } from '../../source';
import { Syntax, State } from '../../context';
import { startTight, trimBlankEnd } from '../../visibility';
import { html, define, defrag } from 'typed-dom/dom';

import IndexParser = ExtensionParser.IndexParser;

export const index: IndexParser = lazy(() => validate('[#', fmap(indexee(surround(
  '[#',
  constraint(State.index, false,
  syntax(Syntax.index, 2, 1, State.linkers | State.media,
  startTight(
  open(stropt(/^\|?/), trimBlankEnd(some(union([
    signature,
    inline,
  ]), ']', [[/^\\?\n/, 9], [']', 2]])), true)))),
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
  ])));

const signature: IndexParser.SignatureParser = lazy(() => creation(fmap(open(
  '|',
  startTight(some(union([bracket, txt]), ']'))),
  ns => [
    html('span', { class: 'indexer', 'data-index': identity(undefined, ns.join(''))!.slice(7) }),
  ])));

const bracket: IndexParser.SignatureParser.BracketParser = lazy(() => creation(union([
  surround(str('('), some(union([bracket, txt]), ')'), str(')'), true),
  surround(str('['), some(union([bracket, txt]), ']'), str(']'), true),
  surround(str('{'), some(union([bracket, txt]), '}'), str('}'), true),
  surround(str('"'), precedence(8, some(txt, '"')), str('"'), true),
])));
