import { AutolinkParser } from '../../inline';
import { union, rewrite, context, open, convert, fmap, lazy } from '../../../combinator';
import { link } from '../link';
import { emoji } from './hashtag';
import { str } from '../../source';
import { define } from 'typed-dom';

export const hashnum: AutolinkParser.HashnumParser = lazy(() => fmap(rewrite(
  open('#', str(new RegExp(String.raw`^[0-9]{1,16}(?![^\p{C}\p{S}\p{P}\s]|${emoji}|['_])`, 'u'))),
  context({ syntax: { inline: {
    link: true,
    autolink: false,
  }}},
  convert(
    source => `[${source}]{ ${source.slice(1)} }`,
    union([link])))),
  ([el]) => [define(el, { class: 'hashnum', href: null })]));
