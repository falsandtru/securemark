import { UListParser, ListItemParser } from '../block';
import { union, inits, some, block, line, rewrite, verify, surround, indent, trim, lazy, fmap } from '../../combinator';
import { contentline } from '../source/line';
import { olist_ } from './olist';
import { ilist } from './ilist';
import { inline } from '../inline';
import { defrag, hasMedia } from '../util';
import { concat } from 'spica/concat';
import { html, frag } from 'typed-dom';

export const ulist: UListParser = lazy(() => block(fmap(
  some(union([
    fmap(
      inits<ListItemParser>([
        line(rewrite(contentline, verify(surround(/^-(?:\s|$)/, defrag(trim(some(inline))), '', false), rs => !hasMedia(frag(rs))))),
        indent(union([ulist, olist_, ilist]))
      ]),
      ns => [html('li', fillFirstLine(ns))])
  ])),
  es => [html('ul', es)])));

export function fillFirstLine(ns: Node[]): Node[] {
  return [HTMLUListElement, HTMLOListElement].some(E => ns[0] instanceof E)
    ? concat([html('br')], ns)
    : ns;
}
