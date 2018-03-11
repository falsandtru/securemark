import { ParagraphParser } from '../block';
import { verify } from './util/verification';
import { combine, subsequence, some, transform, rewrite } from '../../combinator';
import { SubParsers } from '../../combinator/parser';
import { char } from '../source/char';
import { line } from '../source/line';
import { block } from '../source/block';
import { reference } from './paragraph/reference';
import { hashtag } from './paragraph/hashtag';
import { inline, isVisible } from '../inline';
import { squash } from '../squash';
import { html } from 'typed-dom';

const separator = /^\s*$/m;

export const paragraph: ParagraphParser = verify(block(source => {
  if (source === '') return;
  assert(!source.match(/^(?:\\?\s)*?\\?\n/m));
  const rest = source.slice((source.split(separator, 1)[0] || source).length);
  return transform(subsequence<ParagraphParser>([
    some(line(reference)),
    block(some(combine<SubParsers<ParagraphParser>[1]>([
      rewrite(char('\\s'), inline),
      hashtag,
      some(inline, /^\s#\S/),
    ]))),
  ]), cs => {
    const el = html('p', squash(cs));
    for (let i = 0; i < el.children.length; i += 2) {
      const child = el.children[i];
      if (!child.matches('.reference') || !child.nextSibling) break;
      void child.parentElement!.insertBefore(html('br'), child.nextSibling);
    }
    return isVisible(el) || el.querySelector('.media')
      ? [[el], rest]
      : [[], rest];
  })
    (source.slice(0, source.length - rest.length).trim());
}));
