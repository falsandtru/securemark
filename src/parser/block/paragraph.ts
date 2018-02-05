import { ParagraphParser } from '../block';
import { verify } from './util/verification';
import { combine, subsequence, loop } from '../../combinator';
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
  const [cs = []] = subsequence<HTMLElement | Text, ParagraphParser.InnerParsers>([loop(reference), loop(combine<HTMLElement | Text, [ParagraphParser.HashtagParser, InlineParser]>([hashtag, inline]))])(block.replace(emptyline, '').trim()) || [];
  const el = html('p', cs);
  void [...el.children]
    .forEach(el =>
      el.matches('.reference') && el.nextSibling &&
      el.parentElement!.insertBefore(html('br'), el.nextSibling));
  return [[el], rest];
});
