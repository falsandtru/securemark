import { HeadingParser } from '../block';
import { union, some, block, line, verify, match, trim, fmap } from '../../combinator';
import { inline, indexer, defineIndex } from '../inline';
import { defrag, hasText, hasMedia } from '../util';
import { html } from 'typed-dom';

export const heading: HeadingParser = block(line(verify(match(
  /^(#{1,6})\s+([^\n]+)(?:\n|$)/,
  ([, { length: level }, content]) =>
    fmap<HeadingParser>(defrag(trim(some(union([indexer, inline])))), ns => {
      assert(level > 0 && level < 7);
      const el = html(`h${level}` as 'h1', ns);
      void defineIndex(el);
      return [el];
    })(content)),
  ([el]) => hasText(el) && !hasMedia(el))));
