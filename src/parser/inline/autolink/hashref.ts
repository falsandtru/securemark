import { AutolinkParser } from '../../inline';
import { subline, focus } from '../../../combinator';
import { html } from 'typed-dom';

export const hashref: AutolinkParser.HashrefParser = subline(focus(
  /^#[0-9]+(?![a-zA-Z]|[^\x00-\x7F\s])/,
  (tag, state) => [[html('a', { class: 'hashref', rel: 'noopener' }, tag)], '', state]));
