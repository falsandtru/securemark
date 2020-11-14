import { ParserOptions } from '../../..';
import { eval } from '../../combinator';
import { segment } from '../segment';
import { header } from '../header';
import { block } from '../block';
import { normalize } from './normalize';
import { figure } from '../../util/figure';
import { footnote } from '../../util/footnote';
import { frag } from 'typed-dom';
import { push } from 'spica/array';

interface Options extends ParserOptions {
  readonly test?: boolean;
}

export function parse(source: string, opts: Options = {}): DocumentFragment {
  assert(Object.freeze(opts));
  const node = frag([...segment(normalize(source))]
    .reduce((acc, seg, i) =>
      push(acc, eval(i === 0 && header(seg, opts) || block(seg, opts), []))
    , []));
  if (opts.test) return node;
  [...footnote(node, opts.footnotes, opts)];
  [...figure(node, opts.footnotes, opts)];
  assert(opts.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  assert(opts.id !== '' || !opts.footnotes?.annotation.querySelector('[id], .index[href], .label[href]'));
  assert(opts.id !== '' || !opts.footnotes?.reference.querySelector('[id], .index[href], .label[href]'));
  return node;
}
