import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { union, state, constraint, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { emoji } from './hashtag';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

export const hashnum: AutolinkParser.HashnumParser = lazy(() => rewrite(
  open(
    new RegExp([
      /(?<![^\p{C}\p{S}\p{P}\s]|emoji)#/yiu.source,
    ].join('').replace(/emoji/g, emoji), 'yu'),
    str(new RegExp([
      /[0-9]{1,9}(?![0-9a-z@#]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source,
    ].join('').replace(/emoji/g, emoji), 'yu')),
    false,
    [1 | Backtrack.autolink]),
  union([
    constraint(State.autolink, state(State.autolink, fmap(convert(
      source => `[${source}]{ ${source.slice(1)} }`,
      unsafelink,
      false),
      ([el]) => [define(el, { class: 'hashnum', href: null })]))),
    ({ context: { source } }) => [[source]],
  ])));
