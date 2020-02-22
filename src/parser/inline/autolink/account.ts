import { AutolinkParser } from '../../inline';
import { validate, focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

export const account: AutolinkParser.AccountParser = creator(validate('@', focus(
  /^@[A-Za-z0-9]+(?:-[0-9A-Za-z]+)*/,
  source => [[html('a', { class: 'account', rel: 'noopener' }, source)], ''])));
