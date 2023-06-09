import { AutolinkParser } from '../../inline';
import { union, tails, constraint, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { str } from '../../source';
import { State } from '../../context';
import { define } from 'typed-dom/dom';

// https://example/@user must be a user page or a redirect page going there.

export const account: AutolinkParser.AccountParser = lazy(() => fmap(rewrite(
  constraint(State.shortcut, false,
  open(
    '@',
    tails([
      str(/^[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?)*\//i),
      str(/^[a-z][0-9a-z]*(?:[-.][0-9a-z]+)*/i),
    ]))),
  convert(
    source =>
      `[${source}]{ ${
      source.includes('/')
        ? `https://${source.slice(1).replace('/', '/@')}`
        : `/${source}`
      } }`,
    union([unsafelink]))),
  ([el]) => [define(el, { class: 'account' })]));
