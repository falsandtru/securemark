import { ParagraphParser } from '../../block';
import { match, subline } from '../../../combinator';
import '../../source/unescapable';
import { html } from 'typed-dom';

export const hashtag: ParagraphParser.HashtagParser = subline(match(
  /^(#+)\S+/,
  ([tag, { length: level }], rest) =>
    [[html('a', { class: 'hashtag', rel: 'noopener', 'data-level': `${level}` }, tag)], rest]));
