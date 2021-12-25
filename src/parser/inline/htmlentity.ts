import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { union, validate, verify, focus, creator } from '../../combinator';
import { html } from 'typed-dom';

const parser = html('textarea');

export const unsafehtmlentity: UnsafeHTMLEntityParser = creator(validate('&', ';', '\n', verify(focus(
  /^&[0-9A-Za-z]+;/,
  entity => [[(parser.innerHTML = entity, parser.value)], '']),
  ([str]) => str[0] !== '&' || str.length < 3)));

export const htmlentity: HTMLEntityParser = creator(validate('&', ';', '\n', focus(
  /^&[0-9A-Za-z]+;/,
  union([
    unsafehtmlentity,
    str => [[
      html('span', {
        class: 'invalid',
        'data-invalid-syntax': 'htmlentity',
        'data-invalid-type': 'syntax',
        'data-invalid-description': 'Invalid HTML entity.',
      }, str),
    ], '']
  ]))));
