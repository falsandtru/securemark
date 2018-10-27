import { AutolinkParser } from '../../inblock';
import { union, some, match, verify, subline, focus, build } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { compress } from '../../util';
import { html } from 'typed-dom';

export const hashtag: AutolinkParser.HashtagParser = verify(build(() =>
  hashtag_),
  (_, rest) => !rest.startsWith('#'));

export const hashtag_: AutolinkParser.HashtagParser = subline(union([
  match(
    /^(#{1,3})(?!\\(?:\n|$))[^#\s]+?(?=[#\s]|\\?(?:\n|$))/,
    ([tag, { length: level }], rest) =>
      [[html('a', { class: 'hashtag', rel: 'noopener', 'data-level': `${level}` }, tag)], rest]),
  focus(
    /^#+/,
    compress(some(unescsource))),
]));
