import { AutolinkParser } from '../../inblock';
import { union, some, match, verify, subline, focus, lazy } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { defrag } from '../../util';
import { html } from 'typed-dom';

export const hashtag: AutolinkParser.HashtagParser = verify(lazy(() =>
  hashtag_),
  (_, rest) => !rest.startsWith('#'));

export const hashtag_: AutolinkParser.HashtagParser = subline(union([
  match(
    /^#(?!\\(?:\n|$))[^#\s]+?(?=[#\s]|\\?(?:\n|$))/,
    ([tag], rest) =>
      [[html('a', { class: 'hashtag', rel: 'noopener' }, tag)], rest]),
  focus(
    /^#+/,
    defrag(some(unescsource))),
]));
