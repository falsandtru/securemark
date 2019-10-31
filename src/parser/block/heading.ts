import { HeadingParser } from '../block';
import { union, some, block, line, verify, match, memoize, trim, configure, fmap } from '../../combinator';
import { inline, indexer, indexee } from '../inline';
import { defrag, hasText } from '../util';
import { html } from 'typed-dom';

export const heading: HeadingParser = block(some(line(indexee(verify(match(
  /^(#{1,6})\s+(?=\S)/,
  memoize(([, { length: level }]) => level,
  level =>
    fmap(
      configure({ syntax: { inline: { media: false } } },
      defrag(trim(some(union([indexer, inline]))))),
      ns => [html(`h${level}` as 'h1', ns)]))),
  ([el]) => hasText(el))))));
