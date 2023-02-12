import { AutolinkParser } from '../../inline';
import { union, constraint, validate, focus, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { State } from '../../context';
import { define } from 'typed-dom/dom';

// Timeline(pseudonym): user/tid
// Thread(anonymous): cid

// UTC
// tid: YYYY-MMDD-HHMM-SS
// cid: YYYY-MMDD-HHMM-SSmmm

// 内部表現はUnixTimeに統一する(時系列順)
// 外部表現は投稿ごとに投稿者の投稿時のタイムゾーンに統一する(非時系列順)

export const anchor: AutolinkParser.AnchorParser = lazy(() => validate('>>', fmap(
  constraint(State.shortcut, false,
  focus(
    /^>>(?:[a-z][0-9a-z]*(?:-[0-9a-z]+)*\/)?[0-9a-z]+(?:-[0-9a-z]+)*(?![0-9a-z@#:])/i,
    convert(
      source =>
        `[${source}]{ ${
        source.includes('/')
          ? `/@${source.slice(2).replace('/', '/timeline/')}`
          : `?at=${source.slice(2)}`
        } }`,
      union([unsafelink])))),
  ([el]) => [define(el, { class: 'anchor' })])));
