import { UListParser, ListItemParser } from '../block';
import { union, inits, some, block, line, validate, surround, convert, indent, trim, lazy, fmap, eval } from '../../combinator';
import { olist_ } from './olist';
import { ilist_ } from './ilist';
import { inline } from '../inline';
import { defrag, hasMedia } from '../util';
import { concat } from 'spica/concat';
import { html, define } from 'typed-dom';

const opener = /^-(?:\s|$)/;

export const ulist: UListParser = lazy(() => block(fmap(validate(
  /^-(?:[^\S\n]|\n[^\S\n]*\S)/,
  some(union([
    fmap(fmap(
      inits<ListItemParser>([
        line(surround(opener, defrag(trim(some(inline))), '', false)),
        indent(union([ulist_, olist_, ilist_]))
      ]),
      ns => [html('li', fillFirstLine(ns))]),
      ([el]) => hasMedia(el)
        ? [define(el, { class: 'invalid', 'data-invalid-syntax': 'listitem', 'data-invalid-type': 'content' }, eval(defrag(some(inline))('Invalid syntax: ListItem: Unable to contain media syntax in lists.')))]
        : [el])
  ]))),
  es => [html('ul', es)])));

export const ulist_: UListParser = convert(
  source => source.replace(/^-(?=\n|$)/, `$& `),
  ulist);

export function fillFirstLine(ns: Node[]): Node[] {
  return ns[0] instanceof HTMLUListElement || ns[0] instanceof HTMLOListElement
    ? concat([html('br')], ns)
    : ns;
}
