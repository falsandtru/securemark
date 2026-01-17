import { ExtensionParser } from '../../inline';
import { State, Recursion, Backtrack, BacktrackState, Command } from '../../context';
import { union, inits, some, creation, precedence, state, constraint, validate, verify, surround, open, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { indexee, identity } from './indexee';
import { txt, str } from '../../source';
import { tightStart, trimBlankNodeEnd } from '../../visibility';
import { html, define, defrag } from 'typed-dom/dom';

import IndexParser = ExtensionParser.IndexParser;

export const index: IndexParser = lazy(() => constraint(State.index, false, creation(1, Recursion.ignore, fmap(indexee(surround(
  '[#',
  precedence(1, state(State.linkers | State.media,
  tightStart(
  some(inits([
    inline,
    signature,
  ]), ']', [['\n', 9], [']', 1]])))),
  ']',
  false,
  ([, ns], rest) =>
    trimBlankNodeEnd(ns).length > 0
      ? [[html('a', { 'data-index': dataindex(ns) }, defrag(ns))], rest]
      : undefined,
  undefined, 1 | Backtrack.linebracket, Backtrack.bracket | BacktrackState.nobreak)),
  ([el]: [HTMLAnchorElement]) => [
    define(el,
      {
        id: el.id ? null : undefined,
        class: 'index',
        href: el.id ? `#${el.id}` : undefined,
      }),
  ]))));

export const signature: IndexParser.SignatureParser = lazy(() => validate('|', creation(1, Recursion.ignore, fmap(open(
  /^\|(?!\\?\s)/,
  some(verify(union([bracket, txt]), ns => ns[0] !== Command.Escape), ']')),
  ns => [
    html('span', { class: 'indexer', 'data-index': identity('index', undefined, ns.join(''))!.slice(7) }),
  ]))));

const bracket: IndexParser.SignatureParser.BracketParser = lazy(() => creation(0, Recursion.terminal, union([
  surround(str('('), some(union([bracket, txt]), ')'), str(')'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.index),
  surround(str('['), some(union([bracket, txt]), ']'), str(']'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.index),
  surround(str('{'), some(union([bracket, txt]), '}'), str('}'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.index),
  surround(str('"'), precedence(2, some(txt, '"')), str('"'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.index),
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
