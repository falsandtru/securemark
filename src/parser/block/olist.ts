import { undefined } from 'spica/global';
import { OListParser } from '../block';
import { union, inits, some, block, line, focus, validate, context, fmap, convert, indent, trim, lazy } from '../../combinator';
import { defrag } from '../util';
import { ulist_, fillFirstLine } from './ulist';
import { ilist_ } from './ilist';
import { inline } from '../inline';
import { html, define } from 'typed-dom';
import { shift } from 'spica/array';

export const olist: OListParser = lazy(() => block(fmap(validate(
  /^(?=([0-9]+|[a-z]+|[A-Z]+)\.(?=[^\S\n]|\n[^\S\n]*\S))/,
  context({ syntax: { inline: { media: false } } },
  some(union([
    fmap(
      inits([
        line(inits([
          focus(/^(?:[0-9]+|[a-z]+|[A-Z]+)(?![^.\n])\.?(?:$|\s)/, source => [[source.split('.')[0]], '']),
          trim(some(inline)),
        ])),
        indent(union([ulist_, olist_, ilist_]))
      ]),
      (ns: [string, ...(HTMLElement | string)[]]) => [html('li', { value: format(ns[0]), 'data-type': type(ns[0]) }, defrag(fillFirstLine(shift(ns)[1])))]),
  ])))),
  es => {
    const ty = es[0].getAttribute('data-type');
    return [
      html('ol',
        {
          type: ty,
          start: ty === '1' ? es[0].getAttribute('value') : undefined
        },
        es.map(el =>
          define(el, {
            value: ty === '1' ? undefined : null,
            'data-type': null
          })))
    ];
  })));

export const olist_: OListParser = convert(
  source => source.replace(/^([0-9]+|[A-Z]+|[a-z]+)\.?(?=$|\n)/, `$1. `),
  olist);

function type(index: string): undefined | '1' | 'a' | 'A' {
  switch (true) {
    case +index === 0:
      return;
    case +index > 0:
      return '1';
    case index === index.toLowerCase():
      return 'a';
    case index === index.toUpperCase():
      return 'A';
  }
  assert(false);
}

function format(index: string): string | undefined {
  switch (type(index)) {
    case undefined:
      return;
    case '1':
      return `${+index}`;
    case 'a':
      return index;
    case 'A':
      return index;
  }
}
