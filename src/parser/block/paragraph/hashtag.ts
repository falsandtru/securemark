import { ParagraphParser } from '../../block';
import { build, combine, some, surround, transform } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { html } from 'typed-dom';

const syntax = /^(?=#\S)/;
const closer = /^\s/;

export const hashtag: ParagraphParser.HashtagParser = line(transform(build(() =>
  surround(syntax, some(combine<ParagraphParser.HashtagParser>([unescsource]), closer), '')),
  (ts, rest) =>
    [[html('a', { class: 'hashtag', rel: 'noopener' }, ts)], rest]),
  false);
