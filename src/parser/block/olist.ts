import { OListParser, ListItemParser } from '../block';
import { union, inits, some, block, line, verify, surround, match, convert, indent, trim, fmap, eval } from '../../combinator';
import { ulist_, fillFirstLine } from './ulist';
import { ilist_ } from './ilist';
import { inline } from '../inline';
import { defrag, hasMedia, memoize } from '../util';
import { memoize as memorize } from 'spica/memoization';
import { html, define } from 'typed-dom';

const opener = memorize<string, RegExp>(pattern => new RegExp(`^${pattern}(?:\\.\\s|\\.?(?=\\n|$))`));

export const olist: OListParser = block(match(
  /^(?=([0-9]+|[a-z]+|[A-Z]+)\.(?:[^\S\n]|\n[^\S\n]*\S))/,
  memoize(([, index]) => index,
  index =>
    fmap(
      some(union([
        verify(fmap<ListItemParser>(
          inits([
            line(surround(opener(pattern(type(index))), defrag(trim(some(inline))), '', false)),
            indent(union([ulist_, olist_, ilist_]))
          ]),
          ns => [html('li', fillFirstLine(ns))]),
          ([el]) => hasMedia(el)
            ? !!define(el, { class: 'invalid', 'data-invalid-syntax': 'listitem', 'data-invalid-type': 'content' }, eval(defrag(some(inline))('Invalid syntax: ListItem: Unable to contain media syntax in lists.')))
            : true)
      ])),
      es => [html('ol', { start: index, type: type(index) }, es)]))));

export const olist_: OListParser = convert(
  source => source.replace(/^([0-9]+|[A-Z]+|[a-z]+)\.?(?=\n|$)/, `$1. `),
  olist);

function type(index: string): string {
  return Number.isInteger(+index)
    ? '1'
    : index === index.toLowerCase()
      ? 'a'
      : 'A';
}

function pattern(type: string): string {
  assert(['1', 'a', 'A'].includes(type));
  return type === 'A'
    ? '[A-Z]+'
    : type === 'a'
      ? '[a-z]+'
      : '[0-9]+';
}
