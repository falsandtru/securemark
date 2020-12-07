import { HeadingParser } from '../block';
import { union, some, block, line, focus, validate, rewrite, context, fmap, open, trim } from '../../combinator';
import { startTight, defrag } from '../util';
import { inline, indexer, indexee } from '../inline';
import { str } from '../source';
import { html } from 'typed-dom';
import { shift } from 'spica/array';

export const segment: HeadingParser.SegmentParser = block(validate('#', focus(
  /^#{1,6}[^\S\n]+\S[^\n]*(?:\n#{1,6}(?!\S)[^\n]*)*(?:$|\n)/,
  some(line(source => [[source], ''])))));

export const heading: HeadingParser = block(rewrite(segment,
  context({ syntax: { inline: {
    label: false,
    media: false,
  }}},
  some(line(indexee(fmap(union([
    open(
      str(/^##+/),
      trim(startTight(some(union([indexer, inline])))), true),
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
      trim(startTight(some(union([indexer, inline]))))), true),
  ]),
  (ns: [string, ...(HTMLElement | string)[]]) => [html(`h${ns[0].length}` as 'h1', defrag(shift(ns)[1]))])))))));
