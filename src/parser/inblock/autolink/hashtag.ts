import { AutolinkParser } from '../../inblock';
import { match, subline } from '../../../combinator';
import '../../source/unescapable';
import { html } from 'typed-dom';

export const hashtag: AutolinkParser.HashtagParser = subline(match(
  /^#[^#\s]+/,
  ([tag], rest) =>
    [[html('a', { class: 'hashtag', rel: 'noopener' }, tag)], rest]));
