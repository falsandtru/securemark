import { undefined } from 'spica/global';
import { AutolinkParser } from '../../inline';
import { tails, verify, rewrite, creator, open } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom';

// https://example/@user must be a user page or a redirect page going there.

export const account: AutolinkParser.AccountParser = creator(rewrite(
  open(
    '@',
    tails([
      verify(
        str(/^[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*\//),
        ([source]) => source.length <= 253 + 1),
      verify(
        str(/^[A-Za-z][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*/),
        ([source]) => source.length <= 64),
    ])),
  (source, { host, url }) => [[
    html('a',
      {
        class: 'account',
        href: source.includes('/')
          ? `https://${source.slice(1).replace('/', '/@')}`
          : `${url?.origin ?? ''}/${source}`,
        target: source.includes('/') || url && url.origin !== host?.origin
          ? '_blank'
          : undefined,
      },
      source)
  ], '']));
