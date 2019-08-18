import { ParserOptions } from '../../..';
import { eval } from '../../combinator';
import { block } from '../block';
import { segment } from '../segment';
import { normalize } from './normalization';
import { figure, footnote } from '../../util';
import { concat } from 'spica/concat';
import { frag } from 'typed-dom';

export function parse(source: string, opts: ParserOptions = {}): DocumentFragment {
  const node = frag(segment(normalize(source))
    .reduce((acc, seg) =>
      concat(acc, eval(block(seg)))
    , []));
  opts.figure !== false && void figure(node);
  opts.footnote && void footnote(node, opts.footnote);
  return node;
}
