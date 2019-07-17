import { AutolinkParser } from '../../inline';
import { subline, focus } from '../../../combinator';
import { html } from 'typed-dom';

export const hashref: AutolinkParser.HashrefParser = subline(focus(
  /^#[0-9]+/,
  tag => [[html('a', { class: 'hashref', rel: 'noopener' }, tag)], '']));
