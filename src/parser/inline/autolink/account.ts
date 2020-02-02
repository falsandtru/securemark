import { AutolinkParser } from '../../inline';
import { subline, focus } from '../../../combinator';
import { html } from 'typed-dom';

export const account: AutolinkParser.AccountParser = subline(focus(
  /^@[A-Za-z0-9]+(?:-[0-9A-Za-z]+)*/,
  source => [[html('a', { class: 'account', rel: 'noopener' }, source)], '']));
