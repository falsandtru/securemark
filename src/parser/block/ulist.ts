import { UListParser } from '../block';
import { union, inits, subsequence, some, block, line, validate, indent, focus, rewrite, context, creator, open, trim, trimStart, fallback, lazy, fmap } from '../../combinator';
import { olist_ } from './olist';
import { ilist_ } from './ilist';
import { inline, indexer, indexee } from '../inline';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';
import { contentline } from '../source';

export const ulist: UListParser = lazy(() => block(validate(
  /^-(?=[^\S\n]|\n[^\S\n]*\S)/,
  context({ syntax: { inline: { media: false } } },
  ulist_))));

export const ulist_: UListParser = lazy(() => block(fmap(validate(
  /^-(?=$|\s)/,
  some(creator(union([
    indexee(fmap(fallback(
      inits([
        line(open(/^-(?:$|\s)/, trim(subsequence([checkbox, trimStart(some(union([indexer, inline])))])), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      invalid),
      ns => [html('li', defrag(fillFirstLine(ns)))]), true),
  ])))),
  es => [format(html('ul', es))])));

export const checkbox = focus(
  /^\[[xX ]\](?=$|\s)/,
  source => [[
    html('span', { class: 'checkbox' }, source[1].trimStart() ? '☑' : '☐'),
  ], '']);

const invalid = rewrite(contentline, source => [[
  html('span', {
    class: 'invalid',
    'data-invalid-syntax': 'listitem',
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

function format(el: HTMLUListElement): HTMLUListElement {
  if (el.firstElementChild?.firstElementChild?.classList.contains('checkbox')) {
    el.setAttribute('class', 'checklist');
  }
  return el;
}
