import { UListParser } from '../block';
import { Parser } from '../../combinator/data/parser';
import { Recursion } from '../context';
import { union, inits, subsequence, some, recursion, block, line, validate, indent, focus, rewrite, open, trim, fallback, lazy, fmap } from '../../combinator';
import { olist_ } from './olist';
import { ilist_ } from './ilist';
import { inline, indexer, indexee, dataindex } from '../inline';
import { contentline } from '../source';
import { lineable } from '../util';
import { visualize, trimBlank } from '../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const ulist: UListParser = lazy(() => block(validate(
  /^-(?=[^\S\n]|\n[^\S\n]*\S)/,
  ulist_)));

export const ulist_: UListParser = lazy(() => block(fmap(validate(
  /^-(?=$|\s)/,
  some(recursion(Recursion.listitem, union([
    indexee(fmap(fallback(
      inits([
        line(open(/^-(?:$|\s)/, subsequence([
          checkbox,
          trim(visualize(lineable(trimBlank(some(union([indexer, inline])))))),
        ]), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      invalid),
      ns => [html('li', { 'data-index': dataindex(ns) }, defrag(fillFirstLine(ns)))])),
  ])))),
  es => [format(html('ul', es))])));

export const checkbox = focus(
  /^\[[xX ]\](?=$|\s)/,
  ({ source }) => [[
    html('span', { class: 'checkbox' }, source[1].trimStart() ? '☑' : '☐'),
  ], ''], false);

export const invalid = rewrite(
  inits([contentline, indent<Parser<string>>(({ source }) => [[source], ''])]),
  ({ source }) => [[
    '',
    html('span', {
      class: 'invalid',
      'data-invalid-syntax': 'list',
      'data-invalid-type': 'syntax',
      'data-invalid-message': 'Fix the indent or the head of the list item',
    }, source.replace('\n', ''))
  ], '']);

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
