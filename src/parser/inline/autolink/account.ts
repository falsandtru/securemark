import { AutolinkParser } from '../../inline';
import { State } from '../../context';
import { union, tails, state, constraint, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

// https://example/@user must be a user page or a redirect page going there.

export const account: AutolinkParser.AccountParser = lazy(() => constraint(State.autolink, false, rewrite(
  open(
    '@',
    tails([
      str(/^[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?)*\//i),
      str(/^[a-z][0-9a-z]*(?:[-.][0-9a-z]+)*/i),
    ])),
  union([
    state(State.autolink, fmap(convert(
      source =>
        `[${source}]{ ${source.includes('/')
          ? `https://${source.slice(1).replace('/', '/@')}`
          : `/${source}`
        } }`,
      unsafelink),
      ([el]) => [define(el, { class: 'account' })])),
  ]))));
