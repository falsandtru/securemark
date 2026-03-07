import { ExtensionParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Data } from '../../../combinator/data/parser';
import { union, inits, some, precedence, state, constraint, validate, surround, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { indexee, identity } from './indexee';
import { unsafehtmlentity } from '../htmlentity';
import { txt, str } from '../../source';
import { tightStart, trimBlankNodeEnd } from '../../visibility';
import { unwrap } from '../../util';
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
  [3 | Backtrack.bracket],
  ([, bs], context) =>
    context.linebreak === 0 && trimBlankNodeEnd(bs).length > 0
      ? new List([new Data(html('a', { 'data-index': dataindex(bs) }, defrag(unwrap(bs))))])
      : undefined,
  undefined)),
  ns => {
    if (ns.length === 1) {
      const el = ns.head!.value as HTMLElement;
      return new List([
        new Data(define(el, {
          id: el.id ? null : undefined,
          class: 'index',
          href: el.id ? `#${el.id}` : undefined,
        }))
      ]);
    }
    else {
      assert(ns.last?.value === '');
      ns.pop();
      return ns;
    }
  })));

export const signature: IndexParser.SignatureParser = lazy(() => validate('|', surround(
  str(/\|(?!\\?\s)/y),
  some(union([
    unsafehtmlentity,
    some(txt, /(?:[$"`\[\](){}<>（）［］｛｝|])/y),
  ]), ']'),
  /(?=])/y,
  false,
  [3 | Backtrack.bracket],
  ([, ns], context) => {
    const index = identity('index', undefined, ns.foldl((acc, { value }) => acc + value, ''))?.slice(7);
    return index && context.linebreak === 0
      ? new List([new Data(html('span', { class: 'indexer', 'data-index': index }))])
      : undefined;
  },
  ([as, bs]) => bs && as.import(bs))));

export function dataindex(nodes: List<Data<string | HTMLElement>>): string | undefined {
  let node = nodes.last;
  if (typeof node?.value !== 'object') return;
  switch (node.value.tagName) {
    case 'UL':
    case 'OL':
      node = node.prev;
      if (typeof node?.value !== 'object') return;
  }
  if (!node.value.classList.contains('indexer')) return;
  return node.value.getAttribute('data-index') ?? undefined;
}
