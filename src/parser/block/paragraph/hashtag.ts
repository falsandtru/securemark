import { ParagraphParser } from '../../block';
import { combine, loop } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { squash } from '../../squash';

const escape = /^\S#+/;
const closer = /^\s/;

export const hashtag: ParagraphParser.HashtagParser = (source: string) => {
  const [flag = undefined] = source.match(escape) || [];
  if (flag) return [[document.createTextNode(flag)], source.slice(flag.length)];
  if (!source.startsWith('#')) return;
  const line = source.split('\n', 1)[0];
  const [ts = [], rest = undefined] = loop(combine<Text, ParagraphParser.HashtagParser.InnerParsers>([unescsource]), closer)(line) || [];
  if (rest === undefined) return;
  const el = document.createElement('a');
  void el.setAttribute('class', 'hashtag');
  void el.setAttribute('rel', 'noopener');
  void el.appendChild(document.createTextNode(squash(ts).textContent!));
  if (el.textContent!.length < 2) return;
  return [[el], rest + source.slice(line.length)];
};
