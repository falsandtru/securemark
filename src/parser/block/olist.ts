import { undefined } from 'spica/global';
import { OListParser } from '../block';
import { union, inits, subsequence, some, block, line, validate, indent, focus, rewrite, context, creator, open, match, trim, trimStart, fallback, lazy, fmap } from '../../combinator';
import { checkbox, ulist_, fillFirstLine } from './ulist';
import { ilist_ } from './ilist';
import { inline, indexee, indexer } from '../inline';
import { contentline } from '../source';
import { html, define, defrag } from 'typed-dom';
import { memoize } from 'spica/memoize';
import { shift } from 'spica/array';

const openers = {
  '.': /^(?:[0-9]+|[a-z]+|[A-Z]+)(?:-(?!-)[0-9]*)*(?![^\S\n])\.?(?=$|\s)/,
  '(': /^\((?:[0-9]*|[a-z]*)(?![^)\n])\)?(?:-(?!-)[0-9]*)*(?=$|\s)/,
} as const;

export const olist: OListParser = lazy(() => block(validate(
  [
    /^([0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]+)*\.(?=[^\S\n]|\n[^\S\n]*\S)/,
    /^\(([0-9]+|[a-z]+)\)(?:-[0-9]+)*(?=[^\S\n]|\n[^\S\n]*\S)/,
  ],
  context({ syntax: { inline: { media: false } } },
  olist_))));

export const olist_: OListParser = lazy(() => block(union([
  match(
    new RegExp(`^(?=${openers['.'].source.replace('?:', '')})`),
    memoize(ms => list(type(ms[1]), '.'), ms => type(ms[1]))),
  match(
    new RegExp(`^(?=${openers['('].source.replace('?:', '')})`),
    memoize(ms => list(type(ms[1]), '('), ms => type(ms[1]))),
])));

const list = (type: string, delim: string): OListParser.ListParser => fmap(
  some(creator(union([
    indexee(fmap(fallback(
      inits([
        line(open(heads[delim], trim(subsequence([checkbox, trimStart(some(union([indexer, inline])))])), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      invalid),
      (ns: [string, ...(HTMLElement | string)[]]) => [html('li', { 'data-marker': ns[0] }, defrag(fillFirstLine(shift(ns)[1])))]), true),
  ]))),
  es => [format(html('ol', es), type, delim)]);

const heads = {
  '.': focus(
    openers['.'],
    (source: string) => [[`${source.split('.', 1)[0]}.`], '']),
  '(': focus(
    openers['('],
    (source: string) => [[source.replace(/^\($/, '(1)').replace(/^\((\w+)$/, '($1)')], '']),
} as const;

const invalid = rewrite(contentline, source => [[
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

function format(el: HTMLOListElement, type: string, delim: string): HTMLOListElement {
  if (el.firstElementChild?.firstElementChild?.classList.contains('checkbox')) {
    el.setAttribute('class', 'checklist');
  }
  define(el, {
    type: type || undefined,
    'data-format': delim === '.' ? undefined : 'paren',
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
