import { UListParser } from '../block';
import { union, inits, some, capture, surround, verify, indent, fmap, trim } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { olist_ } from './olist';
import { inline } from '../inline';
import { compress, hasMedia } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

const cache = new Map<string, RegExp>();

export const ulist: UListParser = block(capture(
  /^([-+*])(?=\s|$)/,
  ([whole, flag], rest) => {
    const opener = cache.has(flag)
      ? cache.get(flag)!
      : cache.set(flag, new RegExp(`^\\${flag}(?:[^\\S\\n]+|(?=\\n|$))`)).get(flag)!;
    return fmap<UListParser>(
      some(fmap(
        inits<UListParser>([
          line(verify(surround(opener, compress(trim(some(inline))), '', false), rs => !hasMedia(html('b', rs))), true, true),
          indent(union([ulist, olist_]))
        ]),
        ns =>
          [html('li', forceLinebreak(ns))])),
      es =>
        [html('ul', es)])
      (whole + rest);
  }));

export function forceLinebreak(ns: Node[]): Node[] {
  return [HTMLUListElement, HTMLOListElement].some(E => ns[0] instanceof E)
    ? concat([html('br')], ns)
    : ns;
}
