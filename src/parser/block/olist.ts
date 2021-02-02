import { undefined } from 'spica/global';
import { OListParser } from '../block';
import { union, inits, subsequence, some, block, line, indent, focus, context, creator, open, match, convert, trim, lazy, fmap } from '../../combinator';
import { checkbox, ulist_, fillFirstLine } from './ulist';
import { ilist_ } from './ilist';
import { inline } from '../inline';
import { html, define, defrag } from 'typed-dom';
import { memoize } from 'spica/memoize';
import { shift } from 'spica/array';

export const olist: OListParser = lazy(() => block(match(
  /^(?=(?:([0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]+)?(\.)|\(([0-9]+|[a-z]+)(\))(?:-[0-9]+)?)(?=[^\S\n]|\n[^\S\n]*\S))/,
  memoize(
  ms => list(type(ms[1] || ms[3]), ms[2] || ms[4]),
  ms => type(ms[1] || ms[3]) + (ms[2] || ms[4])))));

const list = (type: string, delim: string): OListParser => fmap(
  context({ syntax: { inline: { media: false } } },
  some(creator(union([
    fmap(
      inits([
        line(open(items[delim], trim(subsequence([checkbox, trim(some(inline))])), true)),
        indent(union([ulist_, olist_, ilist_]))
      ]),
      (ns: [string, ...(HTMLElement | string)[]]) => [html('li', { 'data-value': ns[0] }, defrag(fillFirstLine(shift(ns)[1])))]),
  ])))),
  es => [format(html('ol', es), type, delim)]);

const items = {
  '.': focus(
    /^(?:[0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]*)?(?![^.\n])\.?(?:$|\s)/,
    (source: string) => [[`${source.split('.', 1)[0]}.`], '']),
  ')': focus(
    /^\((?:[0-9]*|[a-z]*)(?![^)\n])\)?(?:-[0-9]*)?(?:$|\s)/,
    (source: string) => [[source.trimEnd().replace(/^\((\w+)\)?$/, '($1)').replace(/^\($/, '(1)')], '']),
} as const;

export const olist_: OListParser = convert(
  source =>
    source[0] === '('
      ? source
          .replace(/^\(((?:[0-9]+|[a-z]+))\)?(?:-[0-9]*)?(?=$|\n)/, `($1) `)
          .replace(/^\(\)?(?=$|\n)/, `(1) `)
      : source
          .replace(/^((?:[0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]*)?)\.?(?=$|\n)/, `$1. `),
  olist);

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
  const value = el.firstElementChild?.getAttribute('data-value')!.match(initial(type))?.[0] || '';
  for (let es = el.children, i = 0; i < es.length; ++i) {
    const el = es[i];
    if (el.getAttribute('data-value') !== value) break;
    el.removeAttribute('data-value');
  }
  return el;
}
