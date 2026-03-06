import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Data } from '../../../combinator/data/parser';
import { union, state, constraint, rewrite, surround, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { define } from 'typed-dom/dom';

// https://example/@user must be a user page or a redirect page going there.

export const account: AutolinkParser.AccountParser = lazy(() => rewrite(
  surround(
    /(?<![0-9a-z])@/yi,
    /[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?)*\//yi,
    /[a-z][0-9a-z]*(?:[-.][0-9a-z]+)*(?![-.]?[0-9a-z@#]|>>|:\S)/yi,
    true,
    [3 | Backtrack.autolink]),
  constraint(State.autolink, state(State.autolink, fmap(convert(
    source =>
      `[${source}]{ ${
      source.includes('/')
        ? `https://${source.slice(1).replace('/', '/@')}`
        : `/${source}`
      } }`,
    union([unsafelink]),
    false),
    ([{ value }]) => new List([new Data(define(value, { class: 'account' }))]))))));
