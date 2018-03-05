import { ParagraphParser } from '../block';
import { verify } from './util/verification';
import { combine, subsequence, some } from '../../combinator';
import { reference } from './paragraph/reference';
import { hashtag } from './paragraph/hashtag';
import { inline, InlineParser } from '../inline';
import { html } from 'typed-dom';

const separator = /^\s*$/m;
const emptyline = /^\s*?\\?\n/mg;

export const paragraph: ParagraphParser = verify(source => {
  if (source.split('\n', 1)[0].trim() === '') return;
  const block = source.split(separator, 1)[0];
  assert(block.length > 0);
  const rest = source.slice(block.length);
  const [cs = []] = subsequence<ParagraphParser>([some(reference), some(combine<[ParagraphParser.HashtagParser, InlineParser]>([hashtag, inline]))])(block.replace(emptyline, '').trim()) || [];
  const el = html('p', cs);
  for (const child of el.children) {
    if (child instanceof HTMLBRElement) continue;
    if (!child.matches('.reference') || !child.nextSibling) break;
    void child.parentElement!.insertBefore(html('br'), child.nextSibling);
  }
  return [[el], rest];
});
