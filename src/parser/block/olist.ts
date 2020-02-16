import { OListParser } from '../block';
import { union, inits, some, block, line, validate, convert, indent, trim, update, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { ulist_, fillFirstLine } from './ulist';
import { ilist_ } from './ilist';
import { inline } from '../inline';
import { str } from '../source';
import { html, define } from 'typed-dom';

export const olist: OListParser = lazy(() => block(fmap(validate(
  /^(?=([0-9]+|[a-z]+|[A-Z]+)\.(?:[^\S\n]|\n[^\S\n]*\S))/,
  update({ syntax: { inline: { media: false } } },
  some(union([
    fmap(
      inits([
        line(inits([
          str(/^(?:[0-9]+|[a-z]+|[A-Z]+)(?=\.\s|\.?(?=$|\n))/),
          str(/^\.?\s*/),
          trim(some(inline)),
        ])),
        indent(union([ulist_, olist_, ilist_]))
      ]),
      ([{ data: index }, , ...ns]: [Text, ...Node[]]) => [defrag(html('li', { value: format(index), 'data-type': type(index) }, fillFirstLine(ns)))]),
  ])))),
  es => {
    const ty = es[0].getAttribute('data-type');
    return [
      html('ol',
        {
          type: ty,
          start: ty === '1' ? es[0].getAttribute('value') : void 0
        },
        es.map(el =>
          define(el, {
            value: ty === '1' ? void 0 : null,
            'data-type': null
          })))
    ];
  })));

export const olist_: OListParser = convert(
  source => source.replace(/^([0-9]+|[A-Z]+|[a-z]+)\.?(?=$|\n)/, `$1. `),
  olist);

type IndexType = undefined | '1' | 'a' | 'A';

function type(index: string): IndexType {
  switch (true) {
    case +index === 0:
      return void 0;
    case +index > 0:
      return '1';
    case index === index.toLowerCase():
      return 'a';
    case index === index.toUpperCase():
      return 'A';
    default:
      throw new Error(`${index}`);
  }
}

function format(index: string): string | undefined {
  switch (type(index)) {
    case void 0:
      return void 0;
    case '1':
      return `${+index}`;
    case 'a':
      return index;
    case 'A':
      return index;
  }
}
