import { AutolinkParser } from '../../inline';
import { union, validate, rewrite, context, convert, fmap, lazy } from '../../../combinator';
import { link } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom';

export const anchor: AutolinkParser.AnchorParser = lazy(() => validate('>>', fmap(rewrite(
  str(/^>>[0-9a-z]+(?:-[0-9a-z]+)*(?![0-9A-Za-z@#:])/),
  context({ syntax: { inline: {
    link: true,
    autolink: false,
  }}},
  convert(
    source => `[${source}]{ ?comment=${source.slice(2)} }`,
    union([link])))),
  ([el]) => [define(el, { class: 'anchor' })])));
