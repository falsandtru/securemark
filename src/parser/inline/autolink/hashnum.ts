import { AutolinkParser } from '../../inline';
import { State } from '../../context';
import { union, state, constraint, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { emoji } from './hashtag';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

export const hashnum: AutolinkParser.HashnumParser = lazy(() => rewrite(
  open(
    '#',
    str(new RegExp([
      /[0-9]{1,9}(?![^\p{C}\p{S}\p{P}\s]|emoji)/yu.source,
    ].join('').replace(/emoji/, emoji), 'yu'))),
  union([
    constraint(State.autolink, state(State.autolink, fmap(convert(
      source => `[${source}]{ ${source.slice(1)} }`,
      unsafelink,
      false),
      ([el]) => [define(el, { class: 'hashnum', href: null })]))),
    ({ context: { source } }) => [[source]],
  ])));
