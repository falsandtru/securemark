import { AutolinkParser } from '../../inline';
import { union, tails, verify, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { textlink } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

// https://example/@user must be a user page or a redirect page going there.

export const account: AutolinkParser.AccountParser = lazy(() => fmap(rewrite(
  open(
    '@',
    tails([
      verify(
        str(/^[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?)*\//),
        ([source]) => source.length <= 253 + 1),
      verify(
        str(/^[A-Za-z][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*/),
        ([source]) => source.length <= 64),
    ])),
  convert(
    source =>
      `[${source}]{ ${
      source.includes('/')
        ? `https://${source.slice(1).replace('/', '/@')}`
        : `/${source}`
      } }`,
    union([textlink]))),
  ([el]) => [define(el, { class: 'account' })]));
