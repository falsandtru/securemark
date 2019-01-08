import { AutolinkParser } from '../../inline';
import { union, some, subline, focus, verify, match, lazy } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { defrag } from '../../util';
import { html } from 'typed-dom';

export const hashtag: AutolinkParser.HashtagParser = lazy(() => verify(
  hashtag_,
  (_, rest) => !rest.startsWith('#')));

export const hashtag_: AutolinkParser.HashtagParser = subline(union([
  match(
    /^#((?:[a-zA-Z0-9]|[^\x00-\x7F])+)/,
    ([, tag]) => rest =>
      [[html('a', { class: 'hashtag', rel: 'noopener' }, `#${tag}`)], rest]),
  match(
    /^#{([^#\s{}]+?)}/,
    ([, tag]) => rest =>
      [[html('a', { class: 'hashtag', rel: 'noopener' }, `#${tag}`)], rest]),
  focus(
    /^[a-zA-Z0-9]*#+/,
    defrag(some(unescsource))),
]));
