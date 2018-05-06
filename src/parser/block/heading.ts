import { HeadingParser } from '../block';
import { union, some, capture, bind, trim } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { indexer, defineIndex } from './indexer';
import { inline } from '../inline';
import { compress, hasText, hasMedia } from '../util';
import { html } from 'typed-dom';

export const heading: HeadingParser = block(line(capture(
  /^(#{1,6})\s+([^\n]+)(?:\n|$)/,
  ([, { length: level }, content]) =>
    bind<HeadingParser>(compress(trim(some(union([indexer, inline])))), cs => {
      assert(level > 0 && level < 7);
      const el = html(`h${level}` as 'h1', cs);
      void defineIndex(el);
      if (!hasText(el)) return;
      if (hasMedia(el)) return;
      return [[el], ''];
    })(content)
), true, true));
