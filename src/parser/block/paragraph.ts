import { ParagraphParser } from '../block';
import { combine, subsequence, some, transform, rewrite } from '../../combinator';
import { SubParsers } from '../../combinator/parser';
import { char } from '../source/char';
import { line } from '../source/line';
import { block } from '../source/block';
import { reference } from './paragraph/reference';
import { hashtag } from './paragraph/hashtag';
import { inline, hasContent } from '../inline';
import { squash } from '../util';
import { html } from 'typed-dom';

const separator = /^\s*$/m;
const closer = /^\s#\S/;

export const paragraph: ParagraphParser = block(source => {
  if (source === '') return;
  assert(!source.match(/^(?:\\?\s)*?\\?\n/m));
  const rest = source.slice((source.split(separator, 1)[0] || source).length);
  return transform(subsequence<ParagraphParser>([
    some(line(reference)),
    block(some(combine<SubParsers<ParagraphParser>[1]>([
      rewrite(char('\\s'), inline),
      hashtag,
      some(inline, closer),
    ]))),
  ]), cs => {
    const el = html('p', squash(cs[cs.length - 1] instanceof HTMLBRElement ? cs.slice(0, -1) : cs));
    return hasContent(el)
      ? [[el], rest]
      : [[], rest];
  })
    (source.slice(0, source.length - rest.length).trim());
});
