import { AutolinkParser } from '../../inline';
import { focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

export const account: AutolinkParser.AccountParser = creator(focus(
  /^@[A-Za-z0-9]+(?:-[0-9A-Za-z]+)*/,
  source => [[html('a', { class: 'account', rel: 'noopener' }, source)], '']));
