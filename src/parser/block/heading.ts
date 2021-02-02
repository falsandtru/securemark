import { HeadingParser } from '../block';
import { union, some, block, line, validate, focus, rewrite, context, open, trim, fmap } from '../../combinator';
import { inline, indexer, indexee } from '../inline';
import { str } from '../source';
import { visualize } from '../util';
import { shift } from 'spica/array';
import { html, defrag } from 'typed-dom';

export const segment: HeadingParser.SegmentParser = block(validate('#', focus(
  /^#{1,6}[^\S\n]+\S[^\n]*(?:\n#{1,6}(?!\S)[^\n]*)*(?:$|\n)/,
  some(line(source => [[source], ''])))));

export const heading: HeadingParser = block(rewrite(segment,
  context({ syntax: { inline: {
    label: false,
    media: false,
  }}},
  line(indexee(fmap(union([
    open(
      str(/^##+/),
      visualize(trim(some(union([indexer, inline])))), true),
    open(
      str('#'),
      context({ syntax: { inline: {
        annotation: false,
        reference: false,
        index: false,
        // Redundant
        //label: false,
        link: false,
        // Redundant
        //media: false,
        autolink: false,
      }}},
      visualize(trim(some(union([indexer, inline]))))), true),
  ]),
  (ns: [string, ...(HTMLElement | string)[]]) => [
    html(`h${shift(ns)[0].length}` as 'h1', defrag(ns))
  ]))))));
