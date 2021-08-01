import { AutolinkParser } from '../../inline';
import { union, rewrite, context, open, convert, fmap, lazy } from '../../../combinator';
import { link } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom';

export const hashref: AutolinkParser.HashrefParser = lazy(() => fmap(rewrite(
  open('#', str(/^[0-9]{1,16}(?![0-9A-Za-z'_]|[^\x00-\x7F\s])/)),
  context({ syntax: { inline: {
    link: true,
    autolink: false,
  }}},
  convert(
    source => `[${source}]{ ${source.slice(1)} }`,
    union([link])))),
  ([el]) => [define(el, { class: 'hashref', href: null })]));
