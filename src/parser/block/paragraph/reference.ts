import { ParagraphParser } from '../../block';
import { combine, loop } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { squash } from '../../squash';
import { match } from '../../source/validation';

const syntax = /^>+[^>\s]\S*\s*?(?=\n|$)/;
const closer = /^\s/;

export const reference: ParagraphParser.ReferenceParser = source => {
  if (!match(source, '>', syntax)) return;
  const line = source.split('\n', 1)[0];
  const [ts = [], rest = undefined] = loop(combine<Text, ParagraphParser.HashtagParser.InnerParsers>([unescsource]), closer)(line) || [];
  if (rest === undefined) return;
  const el = document.createElement('span');
  void el.setAttribute('class', 'reference');
  void el.appendChild(document.createTextNode(squash(ts).textContent!));
  return [[el], source.slice(line.length + 1)];
};
