import { ExtensionParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { input, eval } from '../../../combinator/data/parser';
import { union, inits, some, precedence, state, constraint, validate, surround, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { indexee, identity } from './indexee';
import { unsafehtmlentity } from '../htmlentity';
import { txt, str } from '../../source';
import { tightStart, trimBlankNodeEnd } from '../../visibility';
import { unshift, push } from 'spica/array';
import { html, define, defrag } from 'typed-dom/dom';

import IndexParser = ExtensionParser.IndexParser;

export const index: IndexParser = lazy(() => constraint(State.index, fmap(indexee(surround(
  str('[#'),
  precedence(1, state(State.linkers,
  tightStart(
  some(inits([
    inline,
    signature,
  ]), ']', [[']', 1]])))),
  str(']'),
  false,
  ([as, bs, cs], context) => {
    if (context.linebreak === 0 && trimBlankNodeEnd(bs).length > 0) {
      return [[html('a', { 'data-index': dataindex(bs) }, defrag(bs))]];
    }
    return (context.state! & State.linkers) === State.linkers
      ? [push(push(unshift(as, bs), cs), [''])]
      : undefined;
  },
  ([as, bs], context) => {
    return (context.state! & State.linkers) === State.linkers
      ? [push(unshift(as, bs), [''])]
      : undefined;
  },
  [3 | Backtrack.bracket])),
  ns => {
    if (ns.length === 1) {
      const el = ns[0] as HTMLElement;
      return [
        define(el, {
          id: el.id ? null : undefined,
          class: 'index',
          href: el.id ? `#${el.id}` : undefined,
        })
      ];
    }
    else {
      assert(ns.at(-1) === '');
      ns.pop();
      return ns;
    }
  })));

export const signature: IndexParser.SignatureParser = lazy(() => validate('|', surround(
  str(/^\|(?!\\?\s)/),
  tightStart(some(union([inline]), ']', [[']', 1]])),
  /^(?=])/,
  false,
  (_, context) => {
    const { source, position, range = 0 } = context;
    context.offset ??= 0;
    context.offset += position;
    const text = eval(sig(input(source.slice(position - range + 1, position), context)), []).join('');
    context.position = position;
    context.source = source;
    context.offset -= position;
    const index = identity('index', undefined, text)?.slice(7);
    return index
      ? [[html('span', { class: 'indexer', 'data-index': index })]]
      : undefined;
  },
  ([as, bs]) => [unshift(as, bs)])));

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
