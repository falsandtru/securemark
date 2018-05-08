import { ParagraphParser } from '../../block';
import { match } from '../../../combinator';
import { line } from '../../source/line';
import '../../source/unescapable';
import { html } from 'typed-dom';

export const hashtag: ParagraphParser.HashtagParser = line(match(
  /^(#+)\S+/,
  ([tag, { length: level }], rest) =>
    [[html('a', { class: 'hashtag', rel: 'noopener', 'data-level': `${level}` }, tag)], rest]
), false);
