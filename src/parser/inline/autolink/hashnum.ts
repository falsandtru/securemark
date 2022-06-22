import { AutolinkParser } from '../../inline';
import { union, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { textlink } from '../link';
import { emoji } from './hashtag';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

export const hashnum: AutolinkParser.HashnumParser = lazy(() => fmap(rewrite(
  open('#', str(new RegExp(/^[0-9]{1,16}(?![^\p{C}\p{S}\p{P}\s]|emoji|['_])/u.source.replace(/emoji/, emoji), 'u'))),
  convert(
    source => `[${source}]{ ${source.slice(1)} }`,
    union([textlink]))),
  ([el]) => [define(el, { class: 'hashnum', href: null })]));
