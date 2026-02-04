import { HeadingParser } from '../block';
import { State } from '../context';
import { union, some, state, block, line, validate, focus, rewrite, open, fmap } from '../../combinator';
import { inline, indexee, indexer, dataindex } from '../inline';
import { str } from '../source';
import { visualize, trimBlank } from '../visibility';
import { invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const segment: HeadingParser.SegmentParser = block(validate('#', focus(
  /^#+[^\S\n]+\S[^\n]*(?:\n#+(?!\S)[^\n]*)*(?:$|\n)/,
  some(line(({ source }) => [[source], ''])), false)));

export const heading: HeadingParser = block(rewrite(segment,
  // その他の表示制御は各所のCSSで行う。
  state(State.annotation | State.reference | State.index | State.label | State.link | State.media,
  line(indexee(fmap(union([
    open(
      str(/^##+/),
      visualize(trimBlank(some(union([indexer, inline])))), true),
    open(
      str('#'),
      state(State.linkers,
      visualize(trimBlank(some(union([indexer, inline]))))), true),
  ]),
  ([h, ...ns]: [string, ...(HTMLElement | string)[]]) => [
    h.length <= 6
      ? html(`h${h.length as 1}`, { 'data-index': dataindex(ns) }, defrag(ns))
      : html(`h6`, {
          class: 'invalid',
          ...invalid('heading', 'syntax', 'Heading level must be up to 6'),
        }, defrag(ns))
  ]))))));
