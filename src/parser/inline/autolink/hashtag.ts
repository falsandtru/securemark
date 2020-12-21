import { AutolinkParser } from '../../inline';
import { tails, validate, verify, rewrite, creator, open } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom';

// https://example/hashtags/a must be a hashtag page or a redirect page going there.

export const hashtag: AutolinkParser.HashtagParser = creator(rewrite(
  open(
    '#',
    tails([
      verify(
        str(/^[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*\//),
        ([source]) => source.length <= 253 + 1),
      validate(
        /^[0-9]{0,4}(?:[A-Za-z]|[^\x00-\x7F\s])/,
        str(/^(?:[0-9A-Za-z]|[^\x00-\x7F\s]){1,128}(?![0-9A-Za-z]|[^\x00-\x7F\s])/)),
    ])),
  (source, { host, url }) => [[
    html('a',
      {
        class: 'hashtag',
        href: source.indexOf('/') > -1
          ? `https://${source.slice(1).replace('/', '/hashtags/')}`
          : `${url?.origin || ''}/hashtags/${source.slice(1)}`,
        rel: 'noopener',
        target: source.indexOf('/') > -1 || url && url.origin !== host?.origin
          ? '_blank'
          : undefined,
      },
      source)
  ], '']));
