import { HeadingParser } from '../block';
import { union, open, some, block, line, focus, context, fmap, trim } from '../../combinator';
import { defrag } from '../util';
import { inline, indexer, indexee } from '../inline';
import { str } from '../source';
import { html } from 'typed-dom';
import { shift } from 'spica/array';

export const heading: HeadingParser = block(focus(
  /^#{1,6}[^\S\n][^\n]*(?:\n#{1,6}(?:[^\S\n][^\n]*)?)*(?:$|\n)/,
  context({ syntax: { inline: { media: false } } },
  some(line(indexee(fmap(open(
    str(/^#+/),
    trim(some(union([indexer, inline]))), true),
    (ns: [string, ...(HTMLElement | string)[]]) => [html(`h${ns[0].length}` as 'h1', defrag(shift(ns)[1]))])))))));
