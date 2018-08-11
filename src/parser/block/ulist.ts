import { UListParser, ListItemParser } from '../block';
import { union, inits, some, fmap, surround, verify, block, line, focus, indent, trim, build } from '../../combinator';
import { contentline } from '../source/line';
import { olist_ } from './olist';
import { ilist } from './ilist';
import { inline } from '../inline';
import { compress, hasMedia } from '../util';
import { concat } from 'spica/concat';
import { html, frag } from 'typed-dom';

export const ulist: UListParser = block(fmap<UListParser>(build(() =>
  some(union([
    fmap(
      inits<ListItemParser>([
        line(focus(contentline, verify(surround(/^-(?:\s|$)/, compress(trim(some(inline))), '', false), rs => !hasMedia(frag(rs))))),
        indent(union([ulist, olist_, ilist]))
      ]),
      ns => [html('li', fillFirstLine(ns))])
  ]))),
  es => [html('ul', es)]));

export function fillFirstLine(ns: Node[]): Node[] {
  return [HTMLUListElement, HTMLOListElement].some(E => ns[0] instanceof E)
    ? concat([html('br')], ns)
    : ns;
}
