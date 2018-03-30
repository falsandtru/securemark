import { ParagraphParser } from '../block';
import { union, subsequence, some, transform, trim, build } from '../../combinator';
import { block } from '../source/block';
import { reference } from './paragraph/reference';
import { hashtag } from './paragraph/hashtag';
import { inline } from '../inline';
import { compress, hasContent } from '../util';
import { html } from 'typed-dom';

export const paragraph: ParagraphParser = block(transform(build(() =>
  subsequence<ParagraphParser>([
    some(reference),
    compress(trim(some(union([
      hashtag,
      some(inline, /^\s(?=#\S)/), inline
    ])))),
  ])),
  (ns, rest) => {
    const el = html('p', ns[ns.length - 1] instanceof HTMLBRElement ? ns.slice(0, -1) : ns);
    return hasContent(el)
      ? [[el], rest]
      : [[], rest];
  }));
