import { undefined } from 'spica/global';
import { AutolinkParser } from '../../inline';
import { validate, focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

// https://example.com/@user must be a user page or a redirect page going there.

export const account: AutolinkParser.AccountParser = creator(validate('@', focus(
  /^@(?:[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*\/)?[A-Z-a-z][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*/,
  (source, { origin, url }) => {
    if (!verify(source)) return;
    const href = source.includes('/')
      ? `https://${source.slice(1).replace('/', '/@')}`
      : `${url?.origin || ''}/${source}`;
    return [[
      html('a',
        {
          class: 'account',
          href,
          rel: 'noopener',
          target: source.includes('/') || url && url.origin !== origin ? '_blank' : undefined,
        },
        source)
    ], ''];
  })));

export function verify(source: string): true | undefined {
  return source.length - ((source.indexOf('/') + 1) || 1) <= 64
      && source.length - 1 <= 254
      || undefined;
}
