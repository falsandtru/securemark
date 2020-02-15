import { ParserSettings } from '../../..';
import { Ctx, eval } from '../../combinator';
import { block } from '../block';
import { segment } from '../segment';
import { normalize } from './normalize';
import { figure } from '../../util/figure';
import { footnote } from '../../util/footnote';
import { frag, html } from 'typed-dom';
import { push } from 'spica/array';

interface Options extends Partial<ParserSettings> {
  readonly test?: boolean;
  readonly context?: Ctx;
}

export function parse(source: string, opts: Options = {}): DocumentFragment {
  const node = frag(segment(normalize(source))
    .reduce((acc, seg) =>
      push(acc, eval(block(seg, opts.context || {})))
    , []));
  if (opts.test) return node;
  void [...figure(node)];
  void [...footnote(node, opts.footnotes ?? {
    annotation: html('ol'),
    reference: html('ol'),
  })];
  return node;
}
