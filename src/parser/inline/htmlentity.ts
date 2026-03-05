import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { Backtrack } from '../context';
import { List, Data } from '../../combinator/data/parser';
import { union, surround, fmap } from '../../combinator';
import { str } from '../source';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

export const unsafehtmlentity: UnsafeHTMLEntityParser = surround(
  str('&'), str(/[0-9A-Za-z]+/y), str(';'),
  false,
  ([as, bs, cs]) =>
    new List([new Data(parser(as.head!.value + bs.head!.value + cs.head!.value))]),
  ([as, bs]) =>
    new List([new Data(as.head!.value + (bs?.head?.value ?? ''))]),
  [3 | Backtrack.bracket]);

export const htmlentity: HTMLEntityParser = fmap(
  union([unsafehtmlentity]),
  ([{ value }]) => new List([
    length === 1 || value.at(-1) !== ';'
      ? new Data(value)
      : new Data(html('span', {
          class: 'invalid',
          ...invalid('htmlentity', 'syntax', 'Invalid HTML entity'),
        }, value))
  ]));

const parser = (el => (entity: string): string => {
  if (entity === '&NewLine;') return ' ';
  el.innerHTML = entity;
  return el.textContent!;
})(html('span'));
