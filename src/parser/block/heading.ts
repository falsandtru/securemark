import { HeadingParser } from '../block';
import { union, inits, some, block, line, focus, trim, configure, fmap } from '../../combinator';
import { inline, indexer, indexee } from '../inline';
import { char } from '../source/char';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const heading: HeadingParser = block(focus(
  /^#{1,6}[^\S\n][^\n]*(?:\n#{1,6}(?:[^\S\n][^\n]*)?)*(?:$|\n)/,
  configure({ syntax: { inline: { media: false } } },
  some(line(indexee(fmap(inits([
    defrag(some(char('#'))),
    defrag(trim(some(union([indexer, inline])))),
  ]),
  ([flag, ...ns]) => [html(`h${flag.textContent!.length}` as 'h1', ns)])))))));
