import { undefined } from 'spica/global';
import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { union, validate, focus, creator, fmap } from '../../combinator';
import { html } from 'typed-dom';
import { reduce } from 'spica/memoize';

export const unsafehtmlentity: UnsafeHTMLEntityParser = creator(validate('&', focus(
  /^&[0-9A-Za-z]+;/,
  entity => [[parse(entity) ?? `\0${entity}`], ''])));

export const htmlentity: HTMLEntityParser = fmap(
  union([unsafehtmlentity]),
  ([test]) => [
    test[0] === '\0'
      ? html('span', {
          class: 'invalid',
          'data-invalid-syntax': 'htmlentity',
          'data-invalid-type': 'syntax',
          'data-invalid-description': 'Invalid HTML entity.',
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
