import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { union, creation, validate, focus, fmap } from '../../combinator';
import { Recursion } from '../context';
import { html } from 'typed-dom/dom';
import { reduce } from 'spica/memoize';

export const unsafehtmlentity: UnsafeHTMLEntityParser = creation(1, Recursion.ignore, validate('&', focus(
  /^&[0-9A-Za-z]+;/,
  ({ source }) => [[parse(source) ?? `\x1B${source}`], ''])));

export const htmlentity: HTMLEntityParser = fmap(
  union([unsafehtmlentity]),
  ([test]) => [
    test[0] === '\x1B'
      ? html('span', {
          class: 'invalid',
          'data-invalid-syntax': 'htmlentity',
          'data-invalid-type': 'syntax',
          'data-invalid-message': 'Invalid HTML entity',
        }, test.slice(1))
      : test,
  ]);

const parse = reduce((el => (entity: string): string | undefined => {
  if (entity === '&NewLine;') return ' ';
  el.innerHTML = entity;
  const text = el.textContent!;
  return entity === text
    ? undefined
    : text;
})(html('span')));
