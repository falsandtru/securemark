import { ExtensionParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { eval } from '../../../combinator/data/parser';
import { union, inits, some, precedence, state, constraint, validate, surround, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { indexee, identity } from './indexee';
import { unsafehtmlentity } from '../htmlentity';
import { txt, str } from '../../source';
import { tightStart, trimBlankNodeEnd } from '../../visibility';
import { unshift } from 'spica/array';
import { html, define, defrag } from 'typed-dom/dom';

import IndexParser = ExtensionParser.IndexParser;

export const index: IndexParser = lazy(() => constraint(State.index, fmap(indexee(surround(
  '[#',
  precedence(1, state(State.linkers | State.media,
  tightStart(
  some(inits([
    inline,
    signature,
  ]), ']', [[']', 1]])))),
  ']',
  false,
  ([, ns], rest, context) =>
    context.linebreak === undefined &&
    trimBlankNodeEnd(ns).length > 0
      ? [[html('a', { 'data-index': dataindex(ns) }, defrag(ns))], rest]
      : undefined,
  undefined,
  [3 | Backtrack.bracket])),
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
  tightStart(some(union([inline]), ']', [[']', 1]])),
  /^(?=])/,
  false,
  (_, rest, context) => {
    //context.offset ??= 0;
    //context.offset += rest.length;
    const text = eval(sig({ source: context.recent![1], context }), []).join('');
    //context.offset -= rest.length;
    const index = identity('index', undefined, text)?.slice(7);
    return index
      ? [[html('span', { class: 'indexer', 'data-index': index })], rest]
      : undefined;
  },
  ([as, bs], rest) => [unshift(as, bs), rest])));

export function dataindex(ns: readonly (string | HTMLElement)[]): string | undefined {
  if (ns.length === 0) return;
  for (let i = ns.length; i--;) {
    const node = ns[i];
    if (typeof node === 'string') return;
    if (i === ns.length - 1 && ['UL', 'OL'].includes(node.tagName)) continue;
    if (!node.classList.contains('indexer')) return;
    return node.getAttribute('data-index') ?? undefined;
  }
}

const sig: IndexParser.SignatureParser.InternalParser = some(union([
  unsafehtmlentity,
  txt,
]));
