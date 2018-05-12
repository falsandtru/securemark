import { UListParser } from '../block';
import { union, inits, some, surround, verify, indent, fmap, trim, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { olist_ } from './olist';
import { ilist } from './ilist';
import { inline } from '../inline';
import { compress, hasMedia } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

export const ulist: UListParser = block(fmap<UListParser>(build(() =>
  some(fmap(
    inits<UListParser>([
      line(verify(surround(/^-(?:\s|$)/, compress(trim(some(inline))), '', false), rs => !hasMedia(html('b', rs))), true, true),
      indent(union([ulist, olist_, ilist]))
    ]),
    ns =>
      [html('li', fillFirstLine(ns))]))),
  es =>
    [html('ul', es)]));

export function fillFirstLine(ns: Node[]): Node[] {
  return [HTMLUListElement, HTMLOListElement].some(E => ns[0] instanceof E)
    ? concat([html('br')], ns)
    : ns;
}
