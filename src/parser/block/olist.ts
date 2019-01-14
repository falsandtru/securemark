import { OListParser, ListItemParser } from '../block';
import { union, inits, some, block, line, verify, surround, match, indent, trim, fmap } from '../../combinator';
import { ulist, fillFirstLine } from './ulist';
import { ilist } from './ilist';
import { inline } from '../inline';
import { defrag, hasMedia, memoize } from '../util';
import { html, frag } from 'typed-dom';

export const olist: OListParser = block(match(
  /^(?=([0-9]+|[a-z]+|[A-Z]+)\.(?=\s|$))/,
  memoize(([, index]) => [index, type(index), pattern(type(index))],
  ([start, type, pattern]) =>
    fmap<OListParser>(
      some(union([
        fmap(
          inits<ListItemParser>([
            line(verify(surround(new RegExp(`^${pattern}(?:\\.\\s|\\.?(?=\\n|$))`), defrag(trim(some(inline))), '', false), rs => !hasMedia(frag(rs)))),
            indent(union([ulist, olist_, ilist]))
          ]),
          ns => [html('li', fillFirstLine(ns))])
      ])),
      es => [html('ol', { start, type }, es)]))));

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
