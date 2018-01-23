import { AutolinkParser } from '../../inline';
import { combine, loop } from '../../../combinator';
import { text } from '../../source/text';
import { squash } from '../../squash';
import { closer } from './url';

const escape = /^\S#+/;

export const hashtag: AutolinkParser.HashtagParser = (source: string) => {
  const [flag = undefined] = source.match(escape) || [];
  if (flag) return [[document.createTextNode(flag)], source.slice(flag.length)];
  if (!source.startsWith('#')) return;
  const line = source.split('\n', 1)[0];
  const [ts = [], rest = undefined] = loop(combine<HTMLElement | Text, AutolinkParser.HashtagParser.InnerParsers>([text]), closer)(line) || [];
  assert(ts.every(txt => txt instanceof Text));
  if (rest === undefined) return;
  const el = document.createElement('a');
  void el.setAttribute('class', 'hashtag');
  void el.setAttribute('rel', 'noopener');
  void el.appendChild(document.createTextNode(squash(ts).textContent!));
  if (el.textContent!.length < 2) return;
  return [[el], rest + source.slice(line.length)];
};
