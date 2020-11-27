import { AutolinkParser } from '../../inline';
import { validate, focus, creator } from '../../../combinator';
import { verify } from './account';
import { html } from 'typed-dom';

// https://example.com/hashtags/a must be a hashtag page or a redirect page going there.

export const hashtag: AutolinkParser.HashtagParser = creator(validate('#', focus(
  /^#(?:[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*\/)?(?![0-9]+(?![0-9A-Za-z]|[^\x00-\x7F\s]))(?:[0-9A-Za-z]|[^\x00-\x7F\s])+/,
  (source, { host, url }) =>
    verify(source) &&
    [[
      html('a',
        {
          class: 'hashtag',
          href: source.includes('/')
            ? `https://${source.slice(1).replace('/', '/hashtags/')}`
            : `${url?.origin || ''}/hashtags/${source.slice(1)}`,
          rel: 'noopener',
          target: source.includes('/') || url && url.origin !== host?.origin
            ? '_blank'
            : undefined,
        },
        source)
    ], ''])));
