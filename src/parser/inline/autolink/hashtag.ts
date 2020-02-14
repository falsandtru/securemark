import { AutolinkParser } from '../../inline';
import { focus, creation } from '../../../combinator';
import { html } from 'typed-dom';

export const hashtag: AutolinkParser.HashtagParser = creation(focus(
  /^#(?![0-9]+(?![A-Za-z]|[^\x00-\x7F\s]))(?:[A-Za-z0-9]|[^\x00-\x7F\s])+/,
  tag => [[html('a', { class: 'hashtag', rel: 'noopener' }, tag)], '']));
