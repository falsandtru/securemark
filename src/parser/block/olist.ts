import { OListParser } from '../block';
import { union, inits, some, block, line, focus, match, memoize, surround, convert, indent, trim, override, fmap } from '../../combinator';
import { ulist_, fillFirstLine } from './ulist';
import { ilist_ } from './ilist';
import { inline } from '../inline';
import { unescsource } from '../source';
import { defrag } from '../util';
import { memoize as memorize } from 'spica/memoization';
import { html } from 'typed-dom';

const opener = memorize<string, RegExp>(pattern => new RegExp(`^${pattern}(?:\\.\\s|\\.?(?=\\n|$))`));

export const olist: OListParser = block(match(
  /^(?=([0-9]+|[a-z]+|[A-Z]+)\.(?:[^\S\n]|\n[^\S\n]*\S))/,
  memoize(([, index]) => index,
  index =>
    fmap(
      override({ syntax: { inline: { media: false } } },
      some(union([
        fmap(
          inits([
            line(inits([
              focus(
                opener(pattern(type(index))),
                defrag(trim(surround('', some(unescsource, /^[.\n]/), /^\.?/)))),
              defrag(trim(some(inline))),
            ])),
            indent(union([ulist_, olist_, ilist_]))
          ]),
          ([{ textContent: index }, ...ns]) => [html('li', { value: type(index!) === '1' ? format(index!) : undefined }, fillFirstLine(ns))]),
      ]))),
      es => [html('ol', { type: type(index), start: type(index) === '1' ? format(index) : undefined }, es)]))));

export const olist_: OListParser = convert(
  source => source.replace(/^([0-9]+|[A-Z]+|[a-z]+)\.?(?=\n|$)/, `$1. `),
  olist);

type IndexType = undefined | '1' | 'a' | 'A';

function type(index: string): IndexType {
  switch (true) {
    case +index === 0:
      return undefined;
    case Number.isInteger(+index):
      return '1';
    case index === index.toLowerCase():
      return 'a';
    case index === index.toUpperCase():
      return 'A';
    default:
      throw new Error(`${index}`);
  }
}

function pattern(type: IndexType): string {
  switch (type) {
    case undefined:
      return `(?:${pattern('1')}|${pattern('a')}|${pattern('A')})`;
    case '1':
      return '(?:[0-9]+)';
    case 'a':
      return '(?:[a-z]+|0)';
    case 'A':
      return '(?:[A-Z]+|0)';
  }
}

function format(index: string): string | undefined {
  switch (type(index)) {
    case undefined:
      return undefined;
    case '1':
      return `${+index}`;
    case 'a':
      return index;
    case 'A':
      return index;
  }
}
