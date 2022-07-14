import { HeadingParser } from '../block';
import { union, some, state, block, line, validate, focus, rewrite, open, fmap } from '../../combinator';
import { inline, indexee, indexer } from '../inline';
import { str } from '../source';
import { State } from '../context';
import { visualize, trimBlank } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const segment: HeadingParser.SegmentParser = block(validate('#', focus(
  /^#+[^\S\n]+\S[^\n]*(?:\n#+(?!\S)[^\n]*)*(?:$|\n)/,
  some(line(({ source }) => [[source], ''])))));

export const heading: HeadingParser = block(rewrite(segment,
  state(State.annotation | State.reference | State.index | State.label | State.link | State.media,
  line(indexee(fmap(union([
    open(
      str(/^##+/),
      visualize(trimBlank(some(union([indexer, inline])))), true),
    open(
      str('#'),
      state(State.autolink,
      visualize(trimBlank(some(union([indexer, inline]))))), true),
  ]),
  ([h, ...ns]: [string, ...(HTMLElement | string)[]]) => [
    h.length <= 6
      ? html(`h${h.length as 1}`, defrag(ns))
      : html(`h6`, {
          class: 'invalid',
          'data-invalid-syntax': 'heading',
          'data-invalid-type': 'syntax',
          'data-invalid-message': 'Heading level must be up to 6',
        }, defrag(ns))
  ]))))));
