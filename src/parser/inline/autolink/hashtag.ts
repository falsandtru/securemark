import { AutolinkParser } from '../../inline';
import { subline, focus } from '../../../combinator';
import { html } from 'typed-dom';

export const hashtag: AutolinkParser.HashtagParser = subline(focus(
  /^#(?![0-9]+(?![a-zA-Z]|[^\x00-\x7F\s]))(?:[a-zA-Z0-9]|[^\x00-\x7F\s])+/,
  tag => [[html('a', { class: 'hashtag', rel: 'noopener' }, tag)], '']));
