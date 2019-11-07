import { HeadingParser } from '../block';
import { union, sequence, some, block, line, validate, verify, trim, configure, fmap } from '../../combinator';
import { inline, indexer, indexee } from '../inline';
import { char } from '../source/char';
import { defrag, hasText } from '../util';
import { html } from 'typed-dom';

export const heading: HeadingParser = block(some(line(indexee(verify(fmap(validate(
  /^(#{1,6})\s+(?=\S)/,
  configure({ syntax: { inline: { media: false } } },
  sequence([
    defrag(some(char('#'))),
    defrag(trim(some(union([indexer, inline])))),
  ]))),
  ([flag, ...ns]) => [html(`h${flag.textContent!.length}` as 'h1', ns)]),
  ([el]) => hasText(el))))));
