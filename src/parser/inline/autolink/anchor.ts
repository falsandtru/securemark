import { AutolinkParser } from '../../inline';
import { union, validate, focus, context, convert, fmap, lazy } from '../../../combinator';
import { link } from '../link';
import { define } from 'typed-dom';

export const syntax = /^>>[0-9a-z]+(?:-[0-9a-z]+)*(?![0-9A-Za-z@#:])/;

export const anchor: AutolinkParser.AnchorParser = lazy(() => validate('>>', fmap(focus(
  syntax,
  context({ syntax: { inline: {
    link: true,
    autolink: false,
  }}},
  convert(
    source => `[${source}]{ ?at=${source.slice(2)} }`,
    union([link])))),
  ([el]) => [define(el, { class: 'anchor' })])));
