import { UListParser } from '../block';
import { Recursion } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, inits, subsequence, some, recursion, block, line, validate, indent, focus, open, fallback, lazy, fmap } from '../../combinator';
import { olist_ } from './olist';
import { ilist_, ilistitem } from './ilist';
import { inline, indexer, indexee, dataindex } from '../inline';
import { visualize, trimBlank } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const ulist: UListParser = lazy(() => block(validate(
  '- ',
  ulist_)));

export const ulist_: UListParser = lazy(() => block(fmap(validate(
  /-(?=$|[ \r\n])/y,
  recursion(Recursion.listitem, some(union([
    indexee(fmap(fallback(
      inits([
        line(open(/-(?:$|[ \r\n])/y, subsequence([
          checkbox,
          visualize(trimBlank(some(union([indexer, inline])))),
        ]), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      ilistitem),
      ns => new List([new Node(html('li', { 'data-index': dataindex(ns) }, defrag(unwrap(fillFirstLine(ns)))))]))),
  ])))),
  ns => new List([new Node(format(html('ul', unwrap(ns))))]))));

export const checkbox = focus(
  /\[[xX ]\](?=$|[ \r\n])/y,
  ({ source, position }) => new List([
    new Node(html('span', { class: 'checkbox' }, source[position + 1].trimStart() ? '☑' : '☐')),
  ]), false);

export function fillFirstLine(nodes: List<Node<string | HTMLElement>>): List<Node<string | HTMLElement>> {
  const node = nodes.head?.value;
  if (typeof node !== 'object') return nodes;
  switch (node.tagName) {
    case 'UL':
    case 'OL':
      nodes.unshift(new Node(html('br')));
  }
  return nodes;
}

function format(list: HTMLUListElement): HTMLUListElement {
  if (list.firstElementChild?.firstElementChild?.classList.contains('checkbox')) {
    list.classList.add('checklist');
  }
  return list;
}
