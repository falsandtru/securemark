import { ParagraphParser } from '../../block';
import { combine, loop } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { squash } from '../../squash';
import { match } from '../../source/validation';
import { html } from 'typed-dom';

const syntax = /^#\S+/;
const escape = /^\S#+/;
const closer = /^\s/;

export const hashtag: ParagraphParser.HashtagParser = source => {
  const [flag = undefined] = source.match(escape) || [];
  if (flag) return [[document.createTextNode(flag)], source.slice(flag.length)];
  if (!match(source, '#', syntax)) return;
  const line = source.split('\n', 1)[0];
  const [ts = [], rest = undefined] = loop(combine<ParagraphParser.HashtagParser>([unescsource]), closer)(line) || [];
  if (rest === undefined) return;
  return [[html('a', { class: 'hashtag', rel: 'noopener' }, squash(ts))], rest + source.slice(line.length)];
};
