import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { union, state, constraint, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

// Timeline(pseudonym): user/tid
// Thread(anonymous): cid

// UTC
// tid: YYYY-MMDD-HHMM-SS
// cid: YYYY-MMDD-HHMM-SSmmm

// 内部表現はUnixTimeに統一する(時系列順)
// 外部表現は投稿ごとに投稿者の投稿時のタイムゾーンに統一する(非時系列順)

export const anchor: AutolinkParser.AnchorParser = lazy(() => rewrite(
  open(
    /(?<![0-9a-z])>>/yi,
    str(/(?:[a-z][0-9a-z]*(?:-[0-9a-z]+)*\/)?[0-9a-z]+(?:-[0-9a-z]+)*(?![0-9a-z@#]|>>|:\S)/yi),
    false,
    [3 | Backtrack.autolink]),
  union([
    constraint(State.autolink, state(State.autolink, fmap(convert(
      source =>
        `[${source}]{ ${source.includes('/')
          ? `/@${source.slice(2).replace('/', '/timeline?at=')}`
          : `?at=${source.slice(2)}`
        } }`,
      unsafelink,
      false),
      ([el]) => [define(el, { class: 'anchor' })]))),
    ({ context: { source } }) => [[source]],
  ])));
