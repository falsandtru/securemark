import { AutolinkParser } from '../../inline';
import { focus, creation } from '../../../combinator';
import { html } from 'typed-dom';

export const account: AutolinkParser.AccountParser = creation(focus(
  /^@[A-Za-z0-9]+(?:-[0-9A-Za-z]+)*/,
  source => [[html('a', { class: 'account', rel: 'noopener' }, source)], '']));
