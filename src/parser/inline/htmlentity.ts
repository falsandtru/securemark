import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { List, Data } from '../../combinator/data/parser';
import { union, focus, fmap } from '../../combinator';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

export const unsafehtmlentity: UnsafeHTMLEntityParser = focus(
  /&(?:[0-9A-Za-z]+;?)?/y,
  //({ source }) => [[parser(source) ?? `${Command.Error}${source}`], '']));
  ({ context }) => {
    const { source } = context;
    context.position += source.length;
    return source.length > 1 && source.at(-1) === ';'
      ? [new List([new Data(parser(source) ?? source)])]
      : [new List([new Data(source)])];
  });

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

const parser = (el => (entity: string): string | undefined => {
  if (entity === '&NewLine;') return ' ';
  el.innerHTML = entity;
  const text = el.textContent!;
  return entity === text
    ? undefined
    : text;
})(html('span'));
