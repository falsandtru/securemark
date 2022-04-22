import { AutolinkParser } from '../../inline';
import { union, validate, focus, context, convert, fmap, lazy } from '../../../combinator';
import { link } from '../link';
import { define } from 'typed-dom/dom';

// Timeline(pseudonym): user/tid
// Thread(anonymous): cid

// tid: YYYY-MM-DD-HH-MM-SS-TMZ
// cid: YYYY-MM-DD-HH-MM-SS-mmm-TMZ

// 内部表現はUnixTimeに統一する(時系列順)
// 外部表現は投稿ごとに投稿者の投稿時のタイムゾーンに統一する(非時系列順)

export const anchor: AutolinkParser.AnchorParser = lazy(() => validate('>>', fmap(focus(
  /^>>(?:[A-Za-z][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*\/)?[0-9A-Za-z]+(?:-[0-9A-Za-z]+)*(?![0-9A-Za-z@#:])/,
  context({ syntax: { inline: {
    link: true,
    autolink: false,
  }}},
  convert(
    source =>
      `[${source}]{ ${
      source.includes('/')
        ? `/@${source.slice(2).replace('/', '/timeline/')}`
        : `?at=${source.slice(2)}`
      } }`,
    union([link])))),
  ([el]) => [define(el, { class: 'anchor' })])));
