import { AutolinkParser } from '../../inline';
import { subline, focus } from '../../../combinator';
import { html } from 'typed-dom';

export const account: AutolinkParser.AccountParser = subline(focus(
  /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*/,
  (source, state) => [[html('a', { class: 'account', rel: 'noopener' }, source)], '', state]));
