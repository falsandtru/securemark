import { AutolinkParser } from '../../inline';
import { validate, focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

// https://example.com/hashtags/a must be a hashtag page or a redirect page going there.

export const hashtag: AutolinkParser.HashtagParser = creator(validate('#', focus(
  /^#(?![0-9]+(?![0-9A-Za-z]|[^\x00-\x7F\s]))(?:[0-9A-Za-z]|[^\x00-\x7F\s])+/,
  (source, { url }) => [[
    html('a',
      {
        class: 'hashtag',
        href: `${url?.origin || ''}/hashtags/${source.slice(1)}`,
        rel: 'noopener',
        target: url?.origin ? '_blank' : undefined,
      },
      source)
  ], ''])));
