import { HTMLEntityParser } from '../inline';
import { validate, verify, focus, creator } from '../../combinator';
import { html } from 'typed-dom';

const parser = html('textarea');

export const htmlentity: HTMLEntityParser = creator(validate('&', ';', '\n', verify(focus(
  /^&[0-9A-Za-z]+;/,
  entity => [[(parser.innerHTML = entity, parser.value)], '']),
  ([str]) => str[0] !== '&' || str.length < 3)));
