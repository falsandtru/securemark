import { AutolinkParser } from '../../inblock';
import { subline, focus } from '../../../combinator';
import '../../source/unescapable';
import { html } from 'typed-dom';

export const hashtag: AutolinkParser.HashtagParser = subline(focus(
  /^#[^#\s]+/,
  tag => [[html('a', { class: 'hashtag', rel: 'noopener' }, tag)], '']));
