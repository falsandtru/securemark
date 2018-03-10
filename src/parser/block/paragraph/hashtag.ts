import { ParagraphParser } from '../../block';
import { combine, some, bracket, transform } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { squash } from '../../squash';
import { match } from '../../source/validation';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

const syntax = /^#\S+/;
const closer = /^\s/;

export const hashtag: ParagraphParser.HashtagParser = source => {
  if (!match(source, '#', syntax)) return;
  return transform(
    line(bracket('#', some(combine<ParagraphParser.HashtagParser>([unescsource]), closer), ''), false),
    (ts, rest) =>
      ts.length === 0
        ? undefined
        : [[html('a', { class: 'hashtag', rel: 'noopener' }, squash(concat([document.createTextNode('#')], ts)))], rest])
    (source);
};
