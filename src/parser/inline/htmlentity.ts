import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { union, validate, focus, creator, fmap } from '../../combinator';
import { html } from 'typed-dom';

export const unsafehtmlentity: UnsafeHTMLEntityParser = creator(validate('&', focus(
  /^&(?!NewLine;)[0-9A-Za-z]+;/,
  (parser => entity => (
    parser.innerHTML = entity,
    entity = parser.textContent!,
    [[`${entity[0] !== '&' || entity.length === 1 ? '' : '\0'}${entity}`], '']
  ))(html('b')))));

export const htmlentity: HTMLEntityParser = fmap(
  union([unsafehtmlentity]),
  ([str]) => [
    str[0] === '\0'
      ? html('span', {
          class: 'invalid',
          'data-invalid-syntax': 'htmlentity',
          'data-invalid-type': 'syntax',
          'data-invalid-description': 'Invalid HTML entity.',
        }, str.slice(1))
      : str,
  ]);
