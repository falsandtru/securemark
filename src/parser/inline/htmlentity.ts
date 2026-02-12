import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { union, validate, focus, fmap } from '../../combinator';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

export const unsafehtmlentity: UnsafeHTMLEntityParser = validate('&', focus(
  /^&[0-9A-Za-z]{1,99};/,
  //({ source }) => [[parser(source) ?? `${Command.Error}${source}`], '']));
  ({ source }) => [[parser(source) ?? source], '']));

export const htmlentity: HTMLEntityParser = fmap(
  union([unsafehtmlentity]),
  ([text]) => [
    text.length === 1 || text[0] !== '&'
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
