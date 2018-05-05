import { UListParser } from '../block';
import { union, inits, some, capture, surround, verify, indent, transform, trim } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { olist_ } from './olist';
import { inline } from '../inline';
import { compress } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

const cache = new Map<string, RegExp>();

export const ulist: UListParser = block(capture(
  /^([-+*])(?=\s|$)/,
  ([whole, flag], rest) => {
    const opener = cache.has(flag)
      ? cache.get(flag)!
      : cache.set(flag, new RegExp(`^\\${flag}(?:[^\\S\\n]+|(?=\\n|$))`)).get(flag)!;
    return transform(
      some(transform(
        inits<UListParser>([
          line(verify(surround(opener, compress(trim(some(inline))), '', false), rs => !html('b', rs).querySelector('.media')), true, true),
          indent(union([ulist, olist_]))
        ]),
        (ns, rest) =>
          [[html('li', forceLinebreak(ns))], rest])),
      (es, rest) =>
        [[html('ul', es)], rest])
      (whole + rest);
  }));

export function forceLinebreak(ns: Node[]): Node[] {
  return [HTMLUListElement, HTMLOListElement].some(E => ns[0] instanceof E)
    ? concat([html('br')], ns)
    : ns;
}
