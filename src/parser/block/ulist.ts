import { UListParser } from '../block';
import { Recursion } from '../context';
import { List, Data } from '../../combinator/data/parser';
import { union, inits, subsequence, some, recursion, block, line, validate, indent, focus, open, fallback, lazy, fmap } from '../../combinator';
import { olist_ } from './olist';
import { ilist_, ilistitem } from './ilist';
import { inline, indexer, indexee, dataindex } from '../inline';
import { visualize, trimBlank } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const ulist: UListParser = lazy(() => block(validate(
  /- /y,
  ulist_)));

export const ulist_: UListParser = lazy(() => block(fmap(validate(
  /-(?=$|[ \n])/y,
  some(recursion(Recursion.listitem, union([
    indexee(fmap(fallback(
      inits([
        line(open(/-(?:$|[ \n])/y, subsequence([
          checkbox,
          visualize(trimBlank(some(union([indexer, inline])))),
        ]), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      ilistitem),
      ns => new List([new Data(html('li', { 'data-index': dataindex(ns) }, defrag(unwrap(fillFirstLine(ns)))))]))),
  ])))),
  ns => new List([new Data(format(html('ul', unwrap(ns))))]))));

export const checkbox = focus(
  /\[[xX ]\](?=$|[ \n])/y,
  ({ context: { source } }) => [new List([
    new Data(html('span', { class: 'checkbox' }, source[1].trimStart() ? '☑' : '☐')),
  ])]);

export function fillFirstLine(nodes: List<Data<string | HTMLElement>>): List<Data<string | HTMLElement>> {
  const node = nodes.head?.value;
  if (typeof node !== 'object') return nodes;
  switch (node.tagName) {
    case 'UL':
    case 'OL':
      nodes.unshift(new Data(html('br')));
  }
  return nodes;
}

function format(list: HTMLUListElement): HTMLUListElement {
  if (list.firstElementChild?.firstElementChild?.classList.contains('checkbox')) {
    list.classList.add('checklist');
  }
  return list;
}
