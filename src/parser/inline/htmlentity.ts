import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { union, validate, focus, fmap } from '../../combinator';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

export const unsafehtmlentity: UnsafeHTMLEntityParser = validate('&', focus(
  /^&(?:[0-9A-Za-z]+;?)?/,
  //({ source }) => [[parser(source) ?? `${Command.Error}${source}`], '']));
  ({ context }) => {
    const { source } = context;
    context.position += source.length;
    return source.length > 1 && source.at(-1) === ';'
      ? [[parser(source) ?? source]]
      : [[source]];
  }));

export const htmlentity: HTMLEntityParser = fmap(
  union([unsafehtmlentity]),
  ([text]) => [
    length === 1 || text.at(-1) !== ';'
      ? text
      : html('span', {
          class: 'invalid',
          ...invalid('htmlentity', 'syntax', 'Invalid HTML entity'),
      }, text)
  ]);

const parser = (el => (entity: string): string | undefined => {
  if (entity === '&NewLine;') return ' ';
  el.innerHTML = entity;
  const text = el.textContent!;
  return entity === text
    ? undefined
    : text;
})(html('span'));
