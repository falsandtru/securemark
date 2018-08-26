import { AutolinkParser } from '../../inblock';
import { verify, subline, focus, build } from '../../../combinator';
import '../../source/unescapable';
import { html } from 'typed-dom';

export const hashtag: AutolinkParser.HashtagParser = verify(build(() =>
  hashtag_),
  (_, rest) => !rest.startsWith('#'));

export const hashtag_: AutolinkParser.HashtagParser = subline(focus(
  /^#[^#\s]+/,
  tag => [[html('a', { class: 'hashtag', rel: 'noopener' }, tag)], '']));
