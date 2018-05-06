import { ParagraphParser } from '../../block';
import { union, some, surround, fmap } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { compress } from '../../util';
import { html } from 'typed-dom';

export const hashtag: ParagraphParser.HashtagParser = line(
  fmap<ParagraphParser.HashtagParser>(
    surround(/^(?=#\S)/, compress(some(union([unescsource]), /^\s/)), ''),
    ts =>
      [html('a', { class: 'hashtag', rel: 'noopener' }, ts)]),
  false);
