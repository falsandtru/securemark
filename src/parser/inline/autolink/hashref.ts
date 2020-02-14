import { AutolinkParser } from '../../inline';
import { focus, creation } from '../../../combinator';
import { html } from 'typed-dom';

export const hashref: AutolinkParser.HashrefParser = creation(focus(
  /^#[0-9]+(?![A-Za-z]|[^\x00-\x7F\s])/,
  ref => [[html('a', { class: 'hashref', rel: 'noopener' }, ref)], '']));
