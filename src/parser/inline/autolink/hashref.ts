import { AutolinkParser } from '../../inline';
import { validate, focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

export const hashref: AutolinkParser.HashrefParser = creator(validate('#', focus(
  /^#[0-9]+(?![A-Za-z]|[^\x00-\x7F\s])/,
  ref => [[html('a', { class: 'hashref', rel: 'noopener' }, ref)], ''])));
