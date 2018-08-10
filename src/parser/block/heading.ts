import { HeadingParser } from '../block';
import { union, some, match, verify, block, line, fmap, trim } from '../../combinator';
import { indexer, defineIndex } from './indexer';
import { inline } from '../inline';
import { compress, hasText, hasMedia } from '../util';
import { html } from 'typed-dom';

export const heading: HeadingParser = block(line(verify(match(
  /^(#{1,6})\s+([^\n]+)(?:\n|$)/,
  ([, { length: level }, content]) =>
    fmap<HeadingParser>(compress(trim(some(union([indexer, inline])))), ns => {
      assert(level > 0 && level < 7);
      const el = html(`h${level}` as 'h1', ns);
      void defineIndex(el);
      return [el];
    })(content)
), ([el]) => hasText(el) && !hasMedia(el))));
