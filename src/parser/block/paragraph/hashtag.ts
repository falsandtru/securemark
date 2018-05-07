import { ParagraphParser } from '../../block';
import { capture } from '../../../combinator';
import { line } from '../../source/line';
import { html } from 'typed-dom';

export const hashtag: ParagraphParser.HashtagParser = line(capture(
  /^(#+)\S+/,
  ([tag, { length: level }], rest) =>
    [[html('a', { class: 'hashtag', rel: 'noopener', 'data-level': `${level}` }, tag)], rest]
), false);
