import { ExtensionParser } from '../../inline';
import { union, inits, some, syntax, creation, precedence, constraint, validate, surround, open, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { indexee, identity } from './indexee';
import { txt, str } from '../../source';
import { Syntax, State, Recursion } from '../../context';
import { startTight, trimNodeEnd } from '../../visibility';
import { html, define, defrag } from 'typed-dom/dom';

import IndexParser = ExtensionParser.IndexParser;

export const index: IndexParser = lazy(() => validate('[#', creation(1, Recursion.ignore, fmap(indexee(surround(
  '[#',
  constraint(State.index, false,
  syntax(Syntax.index, 2, State.linkers | State.media,
  startTight(
  some(inits([
    inline,
    signature,
  ]), ']', [[/^\\?\n/, 9], [']', 2]])))),
  ']',
  false,
  ([, ns], rest) => [[html('a', trimNodeEnd(defrag(ns)))], rest])),
  ([el]: [HTMLAnchorElement]) => [
    define(el,
      {
        id: el.id ? null : undefined,
        class: 'index',
        href: el.id ? `#${el.id}` : undefined,
      }),
  ]))));

export const signature: IndexParser.SignatureParser = lazy(() => validate('|', creation(1, Recursion.ignore, fmap(open(
  '|',
  startTight(some(union([bracket, txt]), ']'))),
  ns => [
    html('span', { class: 'indexer', 'data-index': identity('index', undefined, ns.join(''))!.slice(7) }),
  ]))));

const bracket: IndexParser.SignatureParser.BracketParser = lazy(() => creation(0, Recursion.terminal, union([
  surround(str('('), some(union([bracket, txt]), ')'), str(')'), true),
  surround(str('['), some(union([bracket, txt]), ']'), str(']'), true),
  surround(str('{'), some(union([bracket, txt]), '}'), str('}'), true),
  surround(str('"'), precedence(3, some(txt, '"')), str('"'), true),
])));
