import { UListParser } from '../block';
import { Recursion } from '../context';
import { union, inits, subsequence, some, recursion, block, line, validate, indent, focus, open, trim, fallback, lazy, fmap } from '../../combinator';
import { olist_ } from './olist';
import { ilist_, ilistitem } from './ilist';
import { inline, indexer, indexee, dataindex } from '../inline';
import { visualize, trimBlank } from '../visibility';
import { unshift } from 'spica/array';
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
          trim(visualize(trimBlank(some(union([indexer, inline]))))),
        ]), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      ilistitem),
      ns => [html('li', { 'data-index': dataindex(ns) }, defrag(fillFirstLine(ns)))])),
  ])))),
  es => [format(html('ul', es))])));

export const checkbox = focus(
  /\[[xX ]\](?=$|[ \n])/y,
  ({ context: { source } }) => [[
    html('span', { class: 'checkbox' }, source[1].trimStart() ? '☑' : '☐'),
  ]]);

export function fillFirstLine(ns: (HTMLElement | string)[]): (HTMLElement | string)[] {
  return ns.length === 1
      && typeof ns[0] === 'object'
      && ['UL', 'OL'].includes(ns[0].tagName)
    ? unshift([html('br')], ns)
    : ns;
}

function format(list: HTMLUListElement): HTMLUListElement {
  if (list.firstElementChild?.firstElementChild?.classList.contains('checkbox')) {
    list.classList.add('checklist');
  }
  return list;
}
