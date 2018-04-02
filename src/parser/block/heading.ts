import { HeadingParser } from '../block';
import { union, some, match, transform, trim } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { indexer, defineIndex } from './indexer';
import { inline } from '../inline';
import { compress, hasText } from '../util';
import { html } from 'typed-dom';

const syntax = /^(#{1,6})\s+([^\n]+)(?:\n|$)/;

export const heading: HeadingParser = block(line(match(syntax, ([, { length: level }, content]) =>
  transform<HeadingParser>(compress(trim(some(union([indexer, inline])))), cs => {
    assert(level > 0 && level < 7);
    const el = html(`h${level}` as 'h1', cs);
    void defineIndex(el);
    if (!hasText(el)) return;
    return [[el], ''];
  })(content)
), true, true));
