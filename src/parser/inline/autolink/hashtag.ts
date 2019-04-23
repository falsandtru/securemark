import { AutolinkParser } from '../../inline';
import { union, some, subline, focus, verify, lazy } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { defrag } from '../../util';
import { html } from 'typed-dom';

export const hashtag: AutolinkParser.HashtagParser = lazy(() => verify(
  hashtag_,
  (_, rest) => !rest.startsWith('#')));

export const hashtag_: AutolinkParser.HashtagParser = subline(union([
  focus(
    /^#(?:[a-zA-Z0-9]|[^\x00-\x7F\s])+/,
    tag =>
      [[html('a', { class: 'hashtag', rel: 'noopener' }, tag)], '']),
  focus(
    /^(?:[a-zA-Z0-9]|[^\x00-\x7F\s])?#+/,
    defrag(some(unescsource))),
]));
