import { OListParser } from '../block';
import { Parser } from '../../combinator/data/parser';
import { union, inits, subsequence, some, creation, state, block, line, validate, indent, focus, rewrite, open, match, fallback, lazy, fmap } from '../../combinator';
import { checkbox, ulist_, fillFirstLine } from './ulist';
import { ilist_ } from './ilist';
import { inline, indexee, indexer } from '../inline';
import { contentline } from '../source';
import { State } from '../context';
import { trimBlank } from '../visibility';
import { memoize } from 'spica/memoize';
import { shift } from 'spica/array';
import { html, define, defrag } from 'typed-dom/dom';

const openers = {
  '.': /^([0-9]+|[a-z]+|[A-Z]+)(?:-(?!-)[0-9]*)*(?![^\S\n])\.?(?:$|\s)/,
  '(': /^\(([0-9]*|[a-z]*)(?![^)\n])\)?(?:-(?!-)[0-9]*)*(?:$|\s)/,
} as const;

export const olist: OListParser = lazy(() => block(validate(
  new RegExp([
    /^([0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]+)*\.(?=[^\S\n]|\n[^\S\n]*\S)/.source,
    /^\(([0-9]+|[a-z]+)\)(?:-[0-9]+)*(?=[^\S\n]|\n[^\S\n]*\S)/.source,
  ].join('|')),
  state(State.media,
  olist_))));

export const olist_: OListParser = lazy(() => block(union([
  match(
    openers['.'],
    memoize(ms => list(type(ms[1]), '.'), ms => type(ms[1]).charCodeAt(0) || 0, [])),
  match(
    openers['('],
    memoize(ms => list(type(ms[1]), '('), ms => type(ms[1]).charCodeAt(0) || 0, [])),
])));

const list = (type: string, form: string): OListParser.ListParser => fmap(
  some(creation(1, false, union([
    indexee(fmap(fallback(
      inits([
        line(open(heads[form], subsequence([checkbox, trimBlank(some(union([indexer, inline])))]), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      invalid),
      (ns: [string, ...(HTMLElement | string)[]]) =>
        [html('li', { 'data-marker': ns[0] || undefined }, defrag(fillFirstLine(shift(ns)[1])))]), true),
  ]))),
  es => [format(html('ol', es), type, form)]);

const heads = {
  '.': focus(
    openers['.'],
    ({ source }) => [[source.trimEnd().split('.', 1)[0] + '.'], '']),
  '(': focus(
    openers['('],
    ({ source }) => [[source.trimEnd().replace(/^\($/, '(1)').replace(/^\((\w+)$/, '($1)')], '']),
} as const;

export const invalid = rewrite(
  inits([contentline, indent<Parser<string>>(({ source }) => [[source], ''])]),
  ({ source }) => [[
    '',
    html('span', {
      class: 'invalid',
      'data-invalid-syntax': 'listitem',
      'data-invalid-type': 'syntax',
      'data-invalid-message': 'Fix the indent or the head of the list item',
    }, source.replace('\n', ''))
  ], '']);

function type(index: string): string {
  switch (index) {
    case 'i':
      return 'i';
    case 'a':
      return 'a';
    case 'I':
      return 'I';
    case 'A':
      return 'A';
    default:
      return '';
  }
}

function style(type: string): string {
  switch (type) {
    case 'i':
      return 'lower-roman';
    case 'a':
      return 'lower-alpha';
    case 'I':
      return 'upper-roman';
    case 'A':
      return 'upper-alpha';
    default:
      return '';
  }
}

function initial(type: string): RegExp {
  switch (type) {
    case 'i':
      return /^\(?i[).]?$/;
    case 'a':
      return /^\(?a[).]?$/;
    case 'I':
      return /^\(?I[).]?$/;
    case 'A':
      return /^\(?A[).]?$/;
    default:
      return /^\(?[01][).]?$/;
  }
}

function format(el: HTMLOListElement, type: string, form: string): HTMLOListElement {
  if (el.firstElementChild?.firstElementChild?.className === 'checkbox') {
    el.setAttribute('class', 'checklist');
  }
  define(el, {
    type: type || undefined,
    'data-format': form === '.' ? undefined : 'paren',
    'data-type': style(type) || undefined,
  });
  const marker = el.firstElementChild?.getAttribute('data-marker')!.match(initial(type))?.[0] ?? '';
  for (let es = el.children, len = es.length, i = 0; i < len; ++i) {
    const el = es[i];
    switch (el.getAttribute('data-marker')) {
      case '':
      case marker:
        el.removeAttribute('data-marker');
        continue;
    }
    break;
  }
  return el;
}
