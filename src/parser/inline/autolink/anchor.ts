import { AutolinkParser } from '../../inline';
import { validate, focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

export const anchor: AutolinkParser.AnchorParser = creator(validate('>>', focus(
  /^>>[0-9A-Za-z]+(?:-[0-9A-Za-z]+)*/,
  source => [[html('a', { class: 'anchor', href: `?res=${source.slice(source.lastIndexOf('>') + 1)}` }, source)], ''])));
