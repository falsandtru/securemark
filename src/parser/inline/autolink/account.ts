import { undefined } from 'spica/global';
import { AutolinkParser } from '../../inline';
import { validate, focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

// https://example.com/@user must be a user page or a redirect page going there.

export const account: AutolinkParser.AccountParser = creator(validate('@', focus(
  /^@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\/)?[A-Z-a-z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*/,
  (source, { origin = '' }) => {
    const url = source.includes('/')
      ? `https://${source.slice(1).replace('/', '/@')}`
      : `${origin}/${source}`;
    return verify(source) && [[html('a', { class: 'account', href: url, rel: 'noopener' }, source)], ''];
  })));

function verify(source: string): true | undefined {
  return source.length - ((source.indexOf('/') + 1) || 1) <= 64
      && source.length - 1 <= 254
      || undefined;
}
