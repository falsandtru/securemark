import { OListParser, ListItemParser } from '../block';
import { union, inits, some, match, surround, verify, indent, fmap, trim } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { ulist, fillFirstLine } from './ulist';
import { ilist } from './ilist';
import { inline } from '../inline';
import { compress, hasMedia } from '../util';
import { html, frag } from 'typed-dom';

const cache = new Map<string, RegExp>();

export const olist: OListParser = block(match(
  /^([0-9]+|[a-z]+|[A-Z]+)\.(?=\s|$)/,
  ([whole, index], rest) => {
    const ty = type(index);
    const opener = cache.has(ty)
      ? cache.get(ty)!
      : cache.set(ty, new RegExp(`^${pattern(ty)}(?:\\.\\s|\\.?(?=\\n|$))`)).get(ty)!;
    return fmap<OListParser>(
      some(union([
        fmap(
          inits<ListItemParser>([
            line(verify(surround(opener, compress(trim(some(inline))), '', false), rs => !hasMedia(frag(rs))), true, true),
            indent(union([ulist, olist_, ilist]))
          ]),
          ns => [html('li', fillFirstLine(ns))])
      ])),
      es => [html('ol', { start: index, type: ty }, es)])
      (whole + rest);
  }));

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
