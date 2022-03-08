import { AutolinkParser } from '../../inline';
import { union, validate, rewrite, context, convert, fmap, lazy } from '../../../combinator';
import { link } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom';

export const syntax = /^>>[0-9a-z]+(?:-[0-9a-z]+)*(?![0-9A-Za-z@#:])/;

export const anchor: AutolinkParser.AnchorParser = lazy(() => validate('>>', fmap(rewrite(
  str(syntax),
  context({ syntax: { inline: {
    link: true,
    autolink: false,
  }}},
  convert(
    source => `[${source}]{ ?comment=${source.slice(2)} }`,
    union([link])))),
  ([el]) => [define(el, { class: 'anchor' })])));
