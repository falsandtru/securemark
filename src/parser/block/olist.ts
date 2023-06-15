import { OListParser } from '../block';
import { union, inits, subsequence, some, creation, block, line, validate, indent, focus, open, match, trim, fallback, lazy, fmap } from '../../combinator';
import { ulist_, checkbox, invalid, fillFirstLine } from './ulist';
import { ilist_ } from './ilist';
import { inline, indexee, indexer } from '../inline';
import { visualize, trimBlank } from '../visibility';
import { memoize } from 'spica/memoize';
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
  olist_)));

export const olist_: OListParser = lazy(() => block(union([
  match(
    openers['.'],
    memoize(ms => list(type(ms[1]), '.'), ms => idx(ms[1]), [])),
  match(
    openers['('],
    memoize(ms => list(type(ms[1]), '('), ms => idx(ms[1]), [])),
])));

const list = (type: string, form: string): OListParser.ListParser => fmap(
  some(creation(1, false, union([
    indexee(fmap(fallback(
      inits([
        line(open(heads[form], subsequence([
          checkbox,
          trim(visualize(trimBlank(some(union([indexer, inline])))))]), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      invalid),
      ns => [html('li', { 'data-marker': ns.shift() as string || undefined }, defrag(fillFirstLine(ns)))]), true),
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

function idx(value: string): number {
  switch (value) {
    case 'i':
      return 1;
    case 'a':
      return 2;
    case 'I':
      return 3;
    case 'A':
      return 4;
    default:
      return 0;
  }
}

function type(value: string): string {
  switch (value) {
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

function pattern(type: string): RegExp {
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

function format(list: HTMLOListElement, type: string, form: string): HTMLOListElement {
  if (list.firstElementChild?.firstElementChild?.classList.contains('checkbox')) {
    list.classList.add('checklist');
  }
  define(list, {
    type: type || undefined,
    'data-format': form === '.' ? undefined : 'paren',
    'data-type': style(type) || undefined,
  });
  const marker = list.firstElementChild?.getAttribute('data-marker') ?? '';
  // TODO: CSSカウンターをattr(start)でリセットできるようになればstart値からのオートインクリメントに対応させる。
  const start = marker.match(pattern(type))?.[0] ?? '';
  for (let es = list.children, len = es.length, i = 0; i < len; ++i) {
    const item = es[i];
    assert(item.getAttribute('data-marker') !== '');
    switch (item.getAttribute('data-marker')) {
      case null:
        continue;
      case start:
        item.removeAttribute('data-marker');
        continue;
      case marker:
        if (i === 0 || item.classList.contains('invalid')) continue;
        define(item, {
          class: 'invalid',
          'data-invalid-syntax': 'list',
          'data-invalid-type': 'index',
          'data-invalid-message': 'Fix the duplicate index',
        });
    }
    break;
  }
  return list;
}
