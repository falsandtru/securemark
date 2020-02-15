import { AutolinkParser } from '../../inline';
import { focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

export const hashref: AutolinkParser.HashrefParser = creator(focus(
  /^#[0-9]+(?![A-Za-z]|[^\x00-\x7F\s])/,
  ref => [[html('a', { class: 'hashref', rel: 'noopener' }, ref)], '']));
