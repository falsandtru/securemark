import { ExtensionParser } from '../../inline';
import { State, Backtrack, BacktrackState } from '../../context';
import { union, inits, some, precedence, state, constraint, validate, surround, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { indexee, identity, text } from './indexee';
import { str } from '../../source';
import { tightStart, trimBlankNodeEnd } from '../../visibility';
import { unshift } from 'spica/array';
import { frag, html, define, defrag } from 'typed-dom/dom';

import IndexParser = ExtensionParser.IndexParser;

export const index: IndexParser = lazy(() => constraint(State.index, false, fmap(indexee(surround(
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
  undefined, [3 | Backtrack.linebracket], Backtrack.bracket | BacktrackState.nobreak)),
  ([el]: [HTMLAnchorElement]) => [
    define(el,
      {
        id: el.id ? null : undefined,
        class: 'index',
        href: el.id ? `#${el.id}` : undefined,
      }),
  ])));

export const signature: IndexParser.SignatureParser = lazy(() => validate('|', surround(
  str(/^\|(?!\\?\s)/),
  some(union([inline]), ']'),
  /^(?=])/,
  false,
  ([as, bs], rest) => {
    const index = identity('index', undefined, text(frag(bs)))?.slice(7);
    return index
      ? [[html('span', { class: 'indexer', 'data-index': index })], rest]
      : [unshift(as, bs), rest];
  },
  ([as, bs], rest) => [unshift(as, bs), rest])));

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
