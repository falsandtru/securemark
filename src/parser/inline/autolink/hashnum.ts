import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Data } from '../../../combinator/data/parser';
import { union, state, constraint, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { emoji } from './hashtag';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

export const hashnum: AutolinkParser.HashnumParser = lazy(() => rewrite(
  open(
    new RegExp([
      /(?<![^\p{C}\p{S}\p{P}\s]|emoji)#/yiu.source,
    ].join('').replace(/emoji/g, emoji.source), 'yu'),
    str(new RegExp([
      /[0-9]{1,9}(?![0-9a-z@#]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source,
    ].join('').replace(/emoji/g, emoji.source), 'yu')),
    false,
    [1 | Backtrack.autolink]),
  constraint(State.autolink, state(State.autolink, fmap(convert(
    source => `[${source}]{ ${source.slice(1)} }`,
    union([unsafelink]),
    false),
    ([{ value }]) => new List([new Data(define(value, { class: 'hashnum', href: null }))])))),
  ));
