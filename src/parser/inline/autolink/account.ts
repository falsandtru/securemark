import { AutolinkParser } from '../../inline';
import { validate, focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

// https://example.com/@user must be a user page or a redirect page going there.

export const account: AutolinkParser.AccountParser = creator(validate('@', focus(
  /^@(?:(?![a-z0-9.-]{0,200}?--)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9]{1,63}){1,2}\/)?[A-Z-a-z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*/,
  (source, { origin = '' }) => {
    const url = source.includes('/')
      ? `https://${source.slice(1).replace('/', '/@')}`
      : `${origin}/${source}`;
    return [[html('a', { class: 'account', href: url, rel: 'noopener' }, source)], ''];
  })));
