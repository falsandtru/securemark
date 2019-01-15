import { UListParser, ListItemParser } from '../block';
import { union, inits, some, block, line, verify, surround, indent, trim, lazy, fmap } from '../../combinator';
import { olist_ } from './olist';
import { ilist } from './ilist';
import { inline } from '../inline';
import { defrag, hasMedia } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

export const ulist: UListParser = lazy(() => block(fmap(
  some(union([
    verify(fmap(
      inits<ListItemParser>([
        line(surround(/^-(?:\s|$)/, defrag(trim(some(inline))), '', false)),
        indent(union([ulist, olist_, ilist]))
      ]),
      ns => [html('li', fillFirstLine(ns))]),
      ([el]) => !hasMedia(el))
  ])),
  es => [html('ul', es)])));

export function fillFirstLine(ns: Node[]): Node[] {
  return ns[0] instanceof HTMLUListElement || ns[0] instanceof HTMLOListElement
    ? concat([html('br')], ns)
    : ns;
}
