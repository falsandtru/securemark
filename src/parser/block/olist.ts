import { OListParser } from '../block';
import { union, inits, some, capture, surround, verify, indent, fmap, trim } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { ulist, forceLinebreak } from './ulist';
import { inline } from '../inline';
import { compress, hasMedia } from '../util';
import { html } from 'typed-dom';

const cache = new Map<string, RegExp>();

export const olist: OListParser = block(capture(
  /^([0-9]+|[A-Z]+|[a-z]+)\.(?=\s|$)/,
  ([whole, index], rest) => {
    const opener = cache.has(index)
      ? cache.get(index)!
      : cache.set(index, new RegExp(`^${pattern(index)}(?:\.[^\\S\\n]+|\.?(?=\\n|$))`)).get(index)!;
    return fmap<OListParser>(
      some(fmap(
        inits<OListParser>([
          line(verify(surround(opener, compress(trim(some(inline))), '', false), rs => !hasMedia(html('b', rs))), true, true),
          indent(union([ulist, olist_]))
        ]),
        ns =>
          [html('li', forceLinebreak(ns))])),
      es =>
        [html('ol', { start: index, type: type(index) }, es)])
      (whole + rest);
  }));

function type(index: string): string {
  return Number.isFinite(+index)
    ? '1'
    : index === index.toLowerCase()
      ? 'a'
      : 'A';
}

function pattern(index: string): string {
  index = type(index);
  return index === 'A'
    ? '[A-Z]+'
    : index === 'a'
      ? '[a-z]+'
      : '[0-9]+';
}

export const olist_: OListParser = (source: string) =>
  olist(source.replace(/^(?:[0-9]+|[A-Z]+|[a-z]+)(?=\n|$)/, `$&.`));
