import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { Command } from '../context';
import { union, validate, focus, fmap } from '../../combinator';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

export const unsafehtmlentity: UnsafeHTMLEntityParser = validate('&', focus(
  /^&[0-9A-Za-z]{1,99};/,
  ({ source }) => [[parse(source) ?? `${Command.Escape}${source}`], '']));

export const htmlentity: HTMLEntityParser = fmap(
  union([unsafehtmlentity]),
  ([text]) => [
    text[0] === Command.Escape
      ? html('span', {
          class: 'invalid',
          ...invalid('htmlentity', 'syntax', 'Invalid HTML entity'),
        }, text.slice(1))
      : text,
  ]);

const parse = (el => (entity: string): string | undefined => {
  if (entity === '&NewLine;') return ' ';
  el.innerHTML = entity;
  const text = el.textContent!;
  return entity === text
    ? undefined
    : text;
})(html('span'));
