import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { Backtrack } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { Flag, isInvisibleHTMLEntityName } from '../node';
import { union, surround, fmap } from '../../combinator';
import { str } from '../source';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

export const unsafehtmlentity: UnsafeHTMLEntityParser = surround(
  str('&'), str(/[0-9A-Za-z]+/y), str(';'),
  false,
  [3 | Backtrack.unescapable],
  ([as, bs, cs]) =>
    new List([
      new Node(
        parser(as.head!.value + bs.head!.value + cs.head!.value),
        isInvisibleHTMLEntityName(bs.head!.value) ? Flag.invisible : Flag.none)
    ]),
  ([as, bs]) =>
    new List([new Node(as.head!.value + (bs?.head?.value ?? ''))]));

export const htmlentity: HTMLEntityParser = fmap(
  union([unsafehtmlentity]),
  ([{ value, flags }]) => new List([
    value.length === 1 || value.at(-1) !== ';'
      ? new Node(value, flags)
      : new Node(html('span', {
          class: 'invalid',
          ...invalid('htmlentity', 'syntax', 'Invalid HTML entity'),
        }, value))
  ]));

const parser = (el => (entity: string): string => {
  if (entity === '&NewLine;') return entity;
  el.innerHTML = entity;
  return el.textContent!;
})(html('span'));
