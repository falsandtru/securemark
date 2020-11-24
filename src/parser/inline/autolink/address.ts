import { AutolinkParser } from '../../inline';
import { validate, focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

export const address: AutolinkParser.AddressParser = creator(validate('>', focus(
  /^>>?[0-9][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*/,
  source => [[html('a', { class: 'address', href: `?res=${source.slice(source.lastIndexOf('>') + 1)}`, rel: 'noopener' }, source)], ''])));
