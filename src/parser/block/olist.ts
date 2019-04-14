import { OListParser } from '../block';
import { union, inits, some, block, line, focus, verify, match, surround, convert, indent, trim, fmap, eval } from '../../combinator';
import { ulist_, fillFirstLine } from './ulist';
import { ilist_ } from './ilist';
import { inline } from '../inline';
import { unescsource } from '../source/unescapable';
import { defrag, hasMedia, memoize } from '../util';
import { memoize as memorize } from 'spica/memoization';
import { html, define } from 'typed-dom';

const opener = memorize<string, RegExp>(pattern => new RegExp(`^${pattern}(?:\\.\\s|\\.?(?=\\n|$))`));

export const olist: OListParser = block(match(
  /^(?=(0|[0-9]+|[a-z]+|[A-Z]+)\.(?:[^\S\n]|\n[^\S\n]*\S))/,
  memoize(([, index]) => index,
  index =>
    fmap(
      some(union([
        verify(fmap<OListParser.ListItemParser>(
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
          ([el]) => hasMedia(el)
            ? !!define(el, { class: 'invalid', 'data-invalid-syntax': 'listitem', 'data-invalid-type': 'content' }, eval(defrag(some(inline))('Invalid syntax: ListItem: Unable to contain media syntax in lists.')))
            : true)
      ])),
      es => [html('ol', { start: format(index), type: type(index) }, es)]))));

export const olist_: OListParser = convert(
  source => source.replace(/^(0|[0-9]+|[A-Z]+|[a-z]+)\.?(?=\n|$)/, `$1. `),
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
      return '(?:0|[0-9]+)';
    case 'a':
      return '(?:0|[a-z]+)';
    case 'A':
      return '(?:0|[A-Z]+)';
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
