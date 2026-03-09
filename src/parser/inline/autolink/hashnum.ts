import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Node } from '../../../combinator/data/parser';
import { state, constraint, surround, lazy } from '../../../combinator';
import { parse } from '../link';
import { emoji } from './hashtag';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

export const hashnum: AutolinkParser.HashnumParser = lazy(() => constraint(State.autolink, state(State.autolink,
  surround(
    new RegExp([
      /(?<![^\p{C}\p{S}\p{P}\s]|emoji)#/yu.source,
    ].join('|').replace(/emoji/g, emoji.source), 'yu'),
    str(new RegExp([
      /[0-9]{1,9}(?![_.-]?[0-9a-z@#]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source,
    ].join('|').replace(/emoji/g, emoji.source), 'yu')),
    '',
    false,
    // unescapableを使用するべきだがhashtagとの重複を回避するためescapableを使用する。
    [3 | Backtrack.escapable],
    ([, [{ value }]], context) =>
      new List([
        new Node(define(parse(
          new List([new Node(`#${value}`)]),
          new List([new Node(value)]),
          context),
          { class: 'hashnum', href: null }))
      ])))));
