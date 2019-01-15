import { OListParser, ListItemParser } from '../block';
import { union, inits, some, block, line, surround, match, indent, trim, fmap, eval } from '../../combinator';
import { ulist, fillFirstLine } from './ulist';
import { ilist } from './ilist';
import { inline } from '../inline';
import { defrag, hasMedia, memoize } from '../util';
import { memoize as memorize } from 'spica/memoization';
import { html, define } from 'typed-dom';

const opener = memorize<string, RegExp>(pattern => new RegExp(`^${pattern}(?:\\.\\s|\\.?(?=\\n|$))`));

export const olist: OListParser = block(match(
  /^(?=([0-9]+|[a-z]+|[A-Z]+)\.(?=\s|$))/,
  memoize(([, index]) => index,
  index =>
    fmap<OListParser>(
      some(union([
        fmap(fmap(
          inits<ListItemParser>([
            line(surround(opener(pattern(type(index))), defrag(trim(some(inline))), '', false)),
            indent(union([ulist, olist_, ilist]))
          ]),
          ns => [html('li', fillFirstLine(ns))]),
          ([el]) => hasMedia(el)
            ? [define(el, { class: 'invalid', 'data-invalid-syntax': 'listitem', 'data-invalid-type': 'content' }, eval(defrag(some(inline))('Invalid syntax: ListItem: Unable to contain media syntax in lists.')))]
            : [el])
      ])),
      es => [html('ol', { start: index, type: type(index) }, es)]))));

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

export const olist_: OListParser = (source: string) =>
  olist(source.replace(/^(?:[0-9]+|[A-Z]+|[a-z]+)(?=\n|$)/, `$&.`));
