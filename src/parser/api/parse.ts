import { ParserSettings } from '../../..';
import { eval } from '../../combinator';
import { block } from '../block';
import { segment } from '../segment';
import { normalize } from './normalize';
import { figure } from '../../util/figure';
import { footnote } from '../../util/footnote';
import { concat } from 'spica/concat';
import { frag, html } from 'typed-dom';

interface Options extends Partial<ParserSettings> {
  readonly test?: boolean;
}

export function parse(source: string, opts: Options = {}): DocumentFragment {
  const node = frag(segment(normalize(source))
    .reduce((acc, seg) =>
      concat(acc, eval(block(seg, {})))
    , []));
  if (opts.test) return node;
  void [...figure(node)];
  void [...footnote(node, opts.footnotes ?? {
    annotation: html('ol'),
    reference: html('ol'),
  })];
  return node;
}
