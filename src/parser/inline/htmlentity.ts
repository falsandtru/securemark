import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { Backtrack } from '../context';
import { isBlankHTMLEntityName } from '../node';
import { List, Node } from '../../combinator/parser';
import { union, surround, fmap } from '../../combinator';
import { str } from '../source';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

export const unsafehtmlentity: UnsafeHTMLEntityParser = surround(
  str('&'), str(/[0-9A-Za-z]+/y), str(';'),
  false,
  [3 | Backtrack.unescapable],
  ([as, bs, cs], _, output) =>
    output.append(
      new Node(
        parser(as.head!.value + bs.head!.value + cs.head!.value),
        as.head!.position,
        isBlankHTMLEntityName(bs.head!.value) ? Node.Flag.blank : Node.Flag.none)),
  ([as, bs], _, output) =>
    output.append(new Node(as.head!.value + (bs?.head?.value ?? ''))));

export const htmlentity: HTMLEntityParser = fmap(
  union([unsafehtmlentity]),
  ([{ value, position, flags }]) => new List([
    value.length === 1 || value.at(-1) !== ';'
      ? new Node(value, position, flags)
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
