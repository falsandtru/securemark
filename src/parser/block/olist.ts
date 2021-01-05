import { undefined } from 'spica/global';
import { OListParser } from '../block';
import { union, inits, some, block, line, indent, focus, context, creator, match, convert, trim, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { ulist_, fillFirstLine } from './ulist';
import { ilist_ } from './ilist';
import { inline } from '../inline';
import { memoize } from 'spica/memoize';
import { shift } from 'spica/array';
import { html } from 'typed-dom';

export const olist: OListParser = lazy(() => block(match(
  /^(?=(?:([0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]+)?(\.)|\(([0-9]+|[a-z]+)(\))(?:-[0-9]+)?)(?=[^\S\n]|\n[^\S\n]*\S))/,
  memoize(
  (ms, ty = type(ms[1] || ms[3]), delim = ms[2] || ms[4]) =>
    fmap(
      context({ syntax: { inline: { media: false } } },
      some(creator(union([
        fmap(
          inits([
            line(inits([
              focus(
                delim === '.'
                  ? /^(?:[0-9]+|[a-z]+|[A-Z]+)(?:-[0-9]*)?(?![^.\n])\.?(?:$|\s)/
                  : /^\((?:[0-9]*|[a-z]*)(?![^)\n])\)?(?:-[0-9]*)?(?:$|\s)/,
                delim === '.'
                  ? source => [[`${source.split('.', 1)[0]}.`], '']
                  : source => [[source.trimEnd().replace(/^\((\w+)\)?$/, '($1)').replace(/^\($/, '(1)')], '']),
              trim(some(inline)),
            ])),
            indent(union([ulist_, olist_, ilist_]))
          ]),
          (ns: [string, ...(HTMLElement | string)[]]) => [html('li', { 'data-value': ns[0] }, defrag(fillFirstLine(shift(ns)[1])))]),
      ])))),
      es => [
        html('ol',
          {
            type: ty || undefined,
            'data-format': delim === '.' ? undefined : 'paren',
            'data-type': style(ty) || undefined,
          },
          format(es, ty)),
      ]),
  ms => type(ms[1] || ms[3]) + (ms[2] || ms[4])))));

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

function format(es: HTMLElement[], type: string): HTMLElement[] {
  assert(es.length > 0);
  const value = es[0].getAttribute('data-value')!.match(initial(type))?.[0] || '';
  for (let i = 0; i < es.length; ++i) {
    const el = es[i];
    if (el.getAttribute('data-value') !== value) break;
    el.removeAttribute('data-value');
  }
  return es;
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
