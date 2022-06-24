import { undefined } from 'spica/global';
import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { union, creator, validate, focus, fmap } from '../../combinator';
import { html } from 'typed-dom/dom';
import { reduce } from 'spica/memoize';

export const unsafehtmlentity: UnsafeHTMLEntityParser = creator(validate('&', focus(
  /^&[0-9A-Za-z]+;/,
  entity => [[parse(entity) ?? `\x1B${entity}`], ''])));

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
})(html('b')));
