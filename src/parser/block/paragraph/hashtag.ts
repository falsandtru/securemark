import { ParagraphParser } from '../../block';
import { combine, some, surround, transform } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { html } from 'typed-dom';

const syntax = /^(?=#\S)/;
const closer = /^\s/;

export const hashtag: ParagraphParser.HashtagParser = source =>
  transform(
    line(surround(syntax, some(combine<ParagraphParser.HashtagParser>([unescsource]), closer), ''), false),
    (ts, rest) =>
      [[html('a', { class: 'hashtag', rel: 'noopener' }, ts)], rest])
    (source);
