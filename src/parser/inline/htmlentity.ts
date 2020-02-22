import { HTMLEntityParser } from '../inline';
import { focus, creator } from '../../combinator';
import { html } from 'typed-dom';

const parser = html('span');

export const htmlentity: HTMLEntityParser = creator(focus(
  /^&[0-9A-Za-z]+;/,
  entity =>
    [[[parser.innerHTML = entity as never, parser.firstChild!.cloneNode() as Text][1]], '']));
