import { ParserSettings } from '../../..';
import { eval } from '../../combinator';
import { block } from '../block';
import { segment } from '../segment';
import { normalize } from './normalize';
import { figure } from '../../util/figure';
import { footnote } from '../../util/footnote';
import { frag, html } from 'typed-dom';
import { push } from 'spica/array';

interface Options extends Partial<ParserSettings> {
  readonly test?: boolean;
}

export function parse(source: string, opts: Options = {}): DocumentFragment {
  const node = frag(segment(normalize(source))
    .reduce((acc, seg) =>
      push(acc, eval(block(seg, opts), []))
    , []));
  if (opts.test) return node;
  void [...footnote(node, opts.footnotes ?? {
    annotation: html('ol'),
    reference: html('ol'),
  })];
  void [...figure(node)];
  return node;
}
