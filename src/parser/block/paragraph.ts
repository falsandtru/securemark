import { ParagraphParser } from '../block';
import { verify } from './util/verification';
import { combine, loop } from '../../combinator';
import { inline } from '../inline';
import { squash } from '../squash';

const separator = /^\s*$/m;
const emptyline = /^\s*?\\?\n/mg;

export const paragraph: ParagraphParser = verify((source: string) => {
  if (source.split('\n', 1)[0].trim() === '') return;
  const block = source.split(separator, 1)[0];
  assert(block.length > 0);
  const rest = source.slice(block.length);
  const [cs = []] = loop(combine<HTMLElement | Text, ParagraphParser.InnerParsers>([inline]))(block.replace(emptyline, '').trim()) || [];
  const el = document.createElement('p');
  void el.appendChild(squash(cs));
  return [[el], rest];
});
