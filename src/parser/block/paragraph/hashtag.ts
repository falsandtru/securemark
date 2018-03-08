import { ParagraphParser } from '../../block';
import { combine, some } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { index } from '../../inline';
import { squash } from '../../squash';
import { match } from '../../source/validation';
import { html } from 'typed-dom';

const syntax = /^#\S+/;
const closer = /^\s/;

export const hashtag: ParagraphParser.HashtagParser = source => {
  if (!match(source, '#', syntax)) return;
  if (index(source)) return;
  const line = source.split('\n', 1)[0];
  const [ts = [], rest = undefined] = some(combine<ParagraphParser.HashtagParser>([unescsource]), closer)(line) || [];
  if (rest === undefined) return;
  return [[html('a', { class: 'hashtag', rel: 'noopener' }, squash(ts))], rest + source.slice(line.length)];
};
