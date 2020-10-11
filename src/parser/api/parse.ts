import { ObjectCreate } from 'spica/alias';
import { ParserSettings } from '../../..';
import { eval } from '../../combinator';
import { segment } from '../segment';
import { header } from '../header';
import { block } from '../block';
import { normalize } from './normalize';
import { figure } from '../../util/figure';
import { footnote } from '../../util/footnote';
import { frag } from 'typed-dom';
import { push } from 'spica/array';

interface Options extends Partial<ParserSettings> {
  readonly test?: boolean;
}

export function parse(source: string, opts: Options = {}): DocumentFragment {
  opts = ObjectCreate(opts);
  const node = frag([...segment(normalize(source))]
    .reduce((acc, seg, i) =>
      push(acc, eval(i === 0 && header(seg, opts) || block(seg, opts), []))
    , []));
  if (opts.test) return node;
  [...footnote(node, opts.footnotes, opts)];
  [...figure(node, opts.footnotes, opts)];
  return node;
}
