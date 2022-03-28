import { HTMLEntityParser, UnsafeHTMLEntityParser } from '../inline';
import { union, validate, focus, creator, fmap } from '../../combinator';
import { html } from 'typed-dom';

const parser = html('textarea');

export const unsafehtmlentity: UnsafeHTMLEntityParser = creator(validate('&', fmap(focus(
  /^&(?!NewLine;)[0-9A-Za-z]+;/,
  entity => [[(parser.innerHTML = entity, parser.value)], '']),
  ([str]) => [
    str[0] !== '&' || str.length < 3
      ? str
      : `\0${str}`,
  ])));

export const htmlentity: HTMLEntityParser = creator(validate('&', fmap(
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
  ])));
