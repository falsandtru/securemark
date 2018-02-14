import { ParagraphParser } from '../../block';
import { combine, loop } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { squash } from '../../squash';
import { match } from '../../source/validation';
import { html } from 'typed-dom';

const syntax = /^>+[^>\s]\S*\s*?(?=\n|$)/;
const closer = /^\s/;

export const reference: ParagraphParser.ReferenceParser = source => {
  if (!match(source, '>', syntax)) return;
  const line = source.split('\n', 1)[0];
  const [ts = [], rest = undefined] = loop(combine<ParagraphParser.HashtagParser>([unescsource]), closer)(line) || [];
  if (rest === undefined) return;
  return [[html('span', { class: 'reference' }, squash(ts).textContent!)], source.slice(line.length + 1)];
};
