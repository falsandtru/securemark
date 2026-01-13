import { AutolinkParser } from '../../inline';
import { State } from '../../context';
import { union, state, constraint, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { emoji } from './hashtag';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

export const hashnum: AutolinkParser.HashnumParser = lazy(() => rewrite(
  open('#', str(new RegExp(/^[0-9]{1,9}(?![^\p{C}\p{S}\p{P}\s]|emoji|['_])/u.source.replace(/emoji/, emoji), 'u'))),
  union([
    constraint(State.autolink, false, state(State.autolink, fmap(convert(
      source => `[${source}]{ ${source.slice(1)} }`,
      unsafelink),
      ([el]) => [define(el, { class: 'hashnum', href: null })]))),
    ({ source }) => [[source], ''],
  ])));
