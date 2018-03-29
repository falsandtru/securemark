import { ParagraphParser } from '../block';
import { combine, subsequence, some, transform, rewrite, trim, build } from '../../combinator';
import { SubParsers } from '../../combinator/parser';
import { char } from '../source/char';
import { line } from '../source/line';
import { block } from '../source/block';
import { reference } from './paragraph/reference';
import { hashtag } from './paragraph/hashtag';
import { inline } from '../inline';
import { compress, hasContent } from '../util';
import { html } from 'typed-dom';

export const paragraph: ParagraphParser = block(transform(build(() =>
  compress(trim(subsequence<ParagraphParser>([
    some(line(reference)),
    block(some(combine<SubParsers<ParagraphParser>[1]>([
      rewrite(char('\\s'), inline),
      hashtag,
      some(inline, /^\s#\S/),
    ]))),
  ])))),
  (ns, rest) => {
    const el = html('p', ns[ns.length - 1] instanceof HTMLBRElement ? ns.slice(0, -1) : ns);
    return hasContent(el)
      ? [[el], rest]
      : [[], rest];
  }));
