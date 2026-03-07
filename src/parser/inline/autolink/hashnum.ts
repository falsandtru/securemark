import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Data } from '../../../combinator/data/parser';
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
      /[0-9]{1,9}(?![0-9a-z@#]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source,
    ].join('|').replace(/emoji/g, emoji.source), 'yu')),
    '',
    false,
    [1 | Backtrack.unescapable],
    ([, [{ value }]], context) =>
      new List([
        new Data(define(parse(
          new List([new Data(`#${value}`)]),
          new List([new Data(value)]),
          context),
          { class: 'hashnum', href: null }))
      ])))));
