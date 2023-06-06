import { UListParser } from '../block';
import { union, inits, subsequence, some, creation, block, line, validate, indent, focus, open, close, trim, fallback, lazy, fmap } from '../../combinator';
import { olist_, invalid } from './olist';
import { ilist_ } from './ilist';
import { inline, indexer, indexee } from '../inline';
import { index } from '../inline/extension/index';
import { visualize, trimBlank } from '../visibility';
import { unshift } from 'spica/array';
import { html, define, defrag } from 'typed-dom/dom';

export const ulist: UListParser = lazy(() => block(validate(
  /^-(?=[^\S\n]|\n[^\S\n]*\S)/,
  ulist_)));

export const ulist_: UListParser = lazy(() => block(fmap(validate(
  /^-(?=$|\s)/,
  some(creation(1, false, union([
    indexee(fmap(fallback(
      inits([
        line(open(/^-(?:$|\s)/, subsequence([checkbox, trim(union([
          fmap(close(union([index]), /^$/), ([el]) => [
            define(el, { class: void el.classList.add('indexer'), 'data-index': '' })
          ]),
          visualize(trimBlank(some(union([indexer, inline])))),
        ]))]), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      invalid),
      ns => [html('li', defrag(fillFirstLine(ns)))]), true),
  ])))),
  es => [format(html('ul', es))])));

export const checkbox = creation(1, false, focus(
  /^\[[xX ]\](?=$|\s)/,
  ({ source }) => [[
    html('span', { class: 'checkbox' }, source[1].trimStart() ? '☑' : '☐'),
  ], '']));

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
