import { ExtensionParser } from '../../inline';
import { union, inits, some, syntax, creation, precedence, constraint, validate, surround, open, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { indexee, identity } from './indexee';
import { txt, str } from '../../source';
import { State, Recursion, Backtrack } from '../../context';
import { startTight, trimNodeEnd } from '../../visibility';
import { html, define, defrag } from 'typed-dom/dom';

import IndexParser = ExtensionParser.IndexParser;

export const index: IndexParser = lazy(() => validate('[#', creation(1, Recursion.ignore, fmap(indexee(surround(
  '[#',
  constraint(State.index, false,
  syntax(2, State.linkers | State.media,
  startTight(
  some(inits([
    inline,
    signature,
  ]), ']', [[/^\\?\n/, 9], [']', 2]])))),
  ']',
  false,
  ([, ns], rest) => [[html('a', { 'data-index': dataindex(ns) }, trimNodeEnd(defrag(ns)))], rest],
  undefined, 1 | Backtrack.bracket)),
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
  surround(str('('), some(union([bracket, txt]), ')'), str(')'), true, undefined, undefined, 3 | Backtrack.index),
  surround(str('['), some(union([bracket, txt]), ']'), str(']'), true, undefined, undefined, 3 | Backtrack.index),
  surround(str('{'), some(union([bracket, txt]), '}'), str('}'), true, undefined, undefined, 3 | Backtrack.index),
  surround(str('"'), precedence(3, some(txt, '"')), str('"'), true, undefined, undefined, 3 | Backtrack.index),
])));

export function dataindex(ns: readonly (string | HTMLElement)[]): string | undefined {
  if (ns.length === 0) return;
  for (let i = ns.length - 1; i >= 0; --i) {
    const node = ns[i];
    if (typeof node === 'string') return;
    if (i === ns.length - 1 && ['UL', 'OL'].includes(node.tagName)) continue;
    if (!node.classList.contains('indexer')) return;
    return node.getAttribute('data-index') ?? undefined;
  }
}
