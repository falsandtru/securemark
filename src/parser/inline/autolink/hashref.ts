import { AutolinkParser } from '../../inline';
import { subline, focus } from '../../../combinator';
import { html } from 'typed-dom';

export const hashref: AutolinkParser.HashrefParser = subline(focus(
  /^#[0-9]+(?![A-Za-z]|[^\x00-\x7F\s])/,
  ref => [[html('a', { class: 'hashref', rel: 'noopener' }, ref)], '']));
