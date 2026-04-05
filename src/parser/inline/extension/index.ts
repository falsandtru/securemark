import { ExtensionParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Node } from '../../../combinator/parser';
import { union, inits, some, precedence, state, constraint, backtrack, validate, surround, setBacktrack, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { indexee, identity } from './indexee';
import { unsafehtmlentity } from '../htmlentity';
import { txt, str } from '../../source';
import { beforeNonblank, trimBlankNodeEnd } from '../../visibility';
import { unwrap } from '../../util';
import { html, define, defrag } from 'typed-dom/dom';

import IndexParser = ExtensionParser.IndexParser;

export const index: IndexParser = lazy(() => constraint(State.index, fmap(indexee(backtrack(surround(
  str('[#', beforeNonblank),
  precedence(1, state(State.linkers,
  some(inits([
    inline,
    signature,
  ]), ']', [[']', 1]]))),
  str(']'),
  false,
  [3 | Backtrack.common],
  ([, bs], input, output) =>
    input.linebreak === 0 && trimBlankNodeEnd(bs).length > 0
      ? output.append(new Node(html('a', { 'data-index': dataindex(bs) }, defrag(unwrap(bs)))))
      : undefined,
  undefined))),
  ns => {
    assert(ns.length === 1);
    const el = ns.head!.value as HTMLAnchorElement;
    return new List([
      new Node(define(el, {
        id: el.id ? null : undefined,
        class: 'index',
        href: el.id ? `#${el.id}` : undefined,
      }))
    ]);
  })));

export const signature: IndexParser.SignatureParser = lazy(() => validate('|', backtrack(surround(
  str(/\|(?!\\?\s)/y),
  precedence(9, some(union([
    unsafehtmlentity,
    some(txt, /(?:[$"`\[\](){}<>（）［］｛｝|])/y),
  ]), ']')),
  /(?=])/y,
  false,
  [3 | Backtrack.escapable],
  ([, ns], input, output) => {
    const { position, range, linebreak } = input;
    const head = position - range;
    const index = identity('index', undefined, ns.foldl((acc, { value }) => acc + value, ''))?.slice(7);
    if (linebreak !== 0 || ns.head!.flags & Node.Flag.blank || !index) {
      return void setBacktrack(input, 2 | Backtrack.escapable, head);
    }
    return output.append(new Node(html('span', { class: 'indexer', 'data-index': index })));
  },
  ([as, bs], _, output) => bs && output.import(as.import(bs))))));

export function dataindex(nodes: List<Node<string | HTMLElement>>): string | undefined {
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
