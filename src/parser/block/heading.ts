import { HeadingParser } from '../block';
import { union, open, some, block, line, focus, trim, update, fmap } from '../../combinator';
import { inline, indexer, indexee } from '../inline';
import { str } from '../source';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const heading: HeadingParser = block(focus(
  /^#{1,6}[^\S\n][^\n]*(?:\n#{1,6}(?:[^\S\n][^\n]*)?)*(?:$|\n)/,
  update({ syntax: { inline: { media: false } } },
  some(line(indexee(fmap(open(
    str(/^#+/),
    trim(some(union([indexer, inline]))), true),
  ns => [html(`h${ns.shift()!.textContent!.length}` as 'h1', defrag(ns))])))))));
