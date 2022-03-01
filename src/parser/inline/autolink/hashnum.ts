import { AutolinkParser } from '../../inline';
import { union, rewrite, context, open, convert, fmap, lazy } from '../../../combinator';
import { link } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom';

export const hashnum: AutolinkParser.HashnumParser = lazy(() => fmap(rewrite(
  open('#', str(/^[0-9]{1,16}(?![^\p{C}\p{S}\p{P}\s]|['_])/u)),
  context({ syntax: { inline: {
    link: true,
    autolink: false,
  }}},
  convert(
    source => `[${source}]{ ${source.slice(1)} }`,
    union([link])))),
  ([el]) => [define(el, { class: 'hashnum', href: null })]));
