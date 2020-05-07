import { AutolinkParser } from '../../inline';
import { validate, focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

// https://example.com/hashtag/a must be a hashtag page or a redirect page going there.

export const hashtag: AutolinkParser.HashtagParser = creator(validate('#', focus(
  /^#(?![0-9])(?:[A-Za-z0-9]|[^\x00-\x7F\s])+/,
  (tag, { domain }) => {
    const url = domain
      ? `https://${domain}/hashtag/${tag.slice(1)}`
      : `/hashtag/${tag.slice(1)}`;
    return [[html('a', { class: 'hashtag', href: url, rel: 'noopener' }, tag)], ''];
  })));
