import { ParagraphParser } from '../block';
import { union, subsequence, some, block, fmap, trim, build } from '../../combinator';
import { reference } from './paragraph/reference';
import { hashtag } from './paragraph/hashtag';
import { inline } from '../inline';
import { compress, hasContent } from '../util';
import { html } from 'typed-dom';

export const paragraph: ParagraphParser = block(fmap(build(() =>
  subsequence<ParagraphParser>([
    some(reference),
    compress(trim(some(union([
      hashtag,
      some(inline, /^\s(?=#\S)/), inline
    ])))),
  ])),
  ns => {
    const el = html('p', dropTrailingLinebreak(ns));
    return hasContent(el)
      ? [el]
      : [];
  }));

function dropTrailingLinebreak(ns: Node[]): Node[] {
  return ns.length > 0 && ns[ns.length - 1] instanceof HTMLBRElement
    ? ns.slice(0, -1)
    : ns;
}
