import { ParagraphParser } from '../../block';
import { union, some, surround, transform } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { compress } from '../../util';
import { html } from 'typed-dom';

export const hashtag: ParagraphParser.HashtagParser = line(transform(
  surround<ParagraphParser.HashtagParser>(/^(?=#\S)/, compress(some(union([unescsource]), /^\s/)), ''),
  (ts, rest) =>
    [[html('a', { class: 'hashtag', rel: 'noopener' }, ts)], rest]
), false);
