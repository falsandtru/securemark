import { eval } from '../../combinator';
import { block } from '../block';
import { segment } from '../segment';
import { normalize } from './normalization';
import { concat } from 'spica/concat';
import { frag } from 'typed-dom';

export function parse(source: string): DocumentFragment {
  return frag(segment(normalize(source))
    .reduce((acc, seg) =>
      concat(acc, eval(block(seg)))
    , []));
}
