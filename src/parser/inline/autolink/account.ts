import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { union, tails, state, constraint, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

// https://example/@user must be a user page or a redirect page going there.

export const account: AutolinkParser.AccountParser = lazy(() => rewrite(
  open(
    /(?<![0-9a-z])@/yi,
    tails([
      str(/[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?)*\//yi),
      str(/[a-z][0-9a-z]*(?:[-.][0-9a-z]+)*(?![0-9a-z@#]|>>|:\S)/yi),
    ]),
    false,
    [3 | Backtrack.autolink]),
  union([
    constraint(State.autolink, state(State.autolink, fmap(convert(
      source =>
        `[${source}]{ ${
          source.includes('/')
            ? `https://${source.slice(1).replace('/', '/@')}`
            : `/${source}`
        } }`,
      unsafelink,
      false),
      ([el]) => [define(el, { class: 'account' })]))),
    ({ context: { source } }) => [[source]],
  ])));
