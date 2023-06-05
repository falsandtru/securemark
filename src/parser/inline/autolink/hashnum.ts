import { AutolinkParser } from '../../inline';
import { union, constraint, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { emoji } from './hashtag';
import { str } from '../../source';
import { State } from '../../context';
import { define } from 'typed-dom/dom';

export const hashnum: AutolinkParser.HashnumParser = lazy(() => fmap(rewrite(
  constraint(State.shortcut, false,
  open('#', str(new RegExp(/^[0-9]{1,9}(?![^\p{C}\p{S}\p{P}\s]|emoji|['_])/u.source.replace(/emoji/, emoji), 'u')))),
  convert(
    source => `[${source}]{ ${source.slice(1)} }`,
    union([unsafelink]))),
  ([el]) => [define(el, { class: 'hashnum', href: null })]));
