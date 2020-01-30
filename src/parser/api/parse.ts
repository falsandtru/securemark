import { ParserConfigs } from '../../..';
import { eval } from '../../combinator';
import { block } from '../block';
import { segment } from '../segment';
import { normalize } from './normalize';
import { figure } from '../../util/figure';
import { footnote } from '../../util/footnote';
import { concat } from 'spica/concat';
import { frag, html } from 'typed-dom';

export function parse(source: string, opts: Partial<ParserConfigs> = {}): DocumentFragment {
  const node = frag(segment(normalize(source))
    .reduce((acc, seg) =>
      concat(acc, eval(block(seg, {})))
    , []));
  void figure(node);
  void footnote(node, opts.footnote ?? {
    annotation: html('ol'),
    reference: html('ol'),
  });
  return node;
}
