import { AutolinkParser } from '../../inblock';
import { match, verify, subline, build } from '../../../combinator';
import '../../source/unescapable';
import { html } from 'typed-dom';

export const hashtag: AutolinkParser.HashtagParser = verify(build(() =>
  hashtag_),
  (_, rest) => !rest.startsWith('#'));

export const hashtag_: AutolinkParser.HashtagParser = subline(match(
  /^(#{1,3})[^#\s]+/,
  ([tag, { length: level }], rest) =>
    [[html('a', { class: 'hashtag', rel: 'noopener', 'data-level': `${level}` }, tag)], rest]));
