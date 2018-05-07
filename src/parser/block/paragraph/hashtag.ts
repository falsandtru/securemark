import { ParagraphParser } from '../../block';
import { union, some, capture, fmap } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { compress } from '../../util';
import { html } from 'typed-dom';

export const hashtag: ParagraphParser.HashtagParser = line(capture(
  /^(?=(#+)\S)/,
  ([, { length: level }], rest) =>
    fmap(
      compress(some(union([unescsource]), /^\s/)),
      ts =>
        [html('a', { class: 'hashtag', rel: 'noopener', 'data-level': `${level}` }, ts)])
      (rest)
), false);
