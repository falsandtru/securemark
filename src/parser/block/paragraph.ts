import { ParagraphParser } from '../block';
import { subsequence, some, fmap, block, trim, build } from '../../combinator';
import { reference } from './paragraph/reference';
import { inblock } from '../inblock';
import { compress, hasContent } from '../util';
import { html } from 'typed-dom';

export const paragraph: ParagraphParser = block(fmap(build(() =>
  subsequence<ParagraphParser>([
    some(reference),
    compress(trim(some(inblock))),
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
