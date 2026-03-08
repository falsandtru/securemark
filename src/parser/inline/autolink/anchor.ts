import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Node } from '../../../combinator/data/parser';
import { state, constraint, surround, lazy } from '../../../combinator';
import { parse } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

// Timeline(pseudonym): user/tid
// Thread(anonymous): cid

// UTC
// tid: YYYY-MMDD-HHMM-SS
// cid: YYYY-MMDD-HHMM-SSmmm

// 内部表現はUnixTimeに統一する(時系列順)
// 外部表現は投稿ごとに投稿者の投稿時のタイムゾーンに統一する(非時系列順)

export const anchor: AutolinkParser.AnchorParser = lazy(() => constraint(State.autolink, state(State.autolink,
  surround(
    /(?<![0-9a-z])>>/yi,
    str(/[0-9a-z]+(?:-[0-9a-z]+)*(?!-?[0-9a-z@#]|>>|:\S)/yi),
    '',
    false,
    [3 | Backtrack.unescapable],
    ([, [{ value }]], context) =>
      new List([
        new Node(define(parse(
          new List([new Node(`>>${value}`)]),
          new List([new Node(`?at=${value}`)]),
          context),
          { class: 'anchor' }))
      ])))));
