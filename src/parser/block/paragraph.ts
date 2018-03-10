import { ParagraphParser } from '../block';
import { verify } from './util/verification';
import { combine, subsequence, some } from '../../combinator';
import { block } from '../source/block';
import { reference } from './paragraph/reference';
import { hashtag } from './paragraph/hashtag';
import { inline, InlineParser } from '../inline';
import { squash } from '../squash';
import { isVisible } from '../source/validation';
import { html } from 'typed-dom';

const separator = /^\s*$/m;
const emptyline = /^(?:\\?\s)*?\\?\n/mg;

export const paragraph: ParagraphParser = verify(block(source => {
  if (source === '') return;
  const block = source.split(separator, 1)[0] || source;
  const rest = source.slice(block.length);
  const [cs = []] = subsequence<ParagraphParser>([some(reference), some(combine<[ParagraphParser.HashtagParser, InlineParser]>([hashtag, inline]))])(block.replace(emptyline, '').trim()) || [];
  const el = html('p', squash(cs));
  for (let i = 0; i < el.children.length; ++i) {
    const child = el.children[i];
    if (child instanceof HTMLBRElement) continue;
    if (!child.matches('.reference') || !child.nextSibling) break;
    void child.parentElement!.insertBefore(html('br'), child.nextSibling);
  }
  return isVisible(el.textContent!) || el.querySelector('.media')
    ? [[el], rest]
    : [[], rest];
}));
