import { HeadingParser } from '../block';
import { union, some, block, line, validate, focus, rewrite, context, open, trim, fmap } from '../../combinator';
import { inline, indexee, indexer } from '../inline';
import { str } from '../source';
import { visualize } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const segment: HeadingParser.SegmentParser = block(validate('#', focus(
  /^#+[^\S\n]+\S[^\n]*(?:\n#+(?!\S)[^\n]*)*(?:$|\n)/,
  some(line(source => [[source], ''])))));

export const heading: HeadingParser = block(rewrite(segment,
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    index: false,
    label: false,
    link: false,
    media: false,
  }}},
  line(indexee(fmap(union([
    open(
      str(/^##+/),
      trim(visualize(some(union([indexer, inline])))), true),
    open(
      str('#'),
      context({ syntax: { inline: {
        autolink: false,
      }}},
      trim(visualize(some(union([indexer, inline]))))), true),
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
