import { HeadingParser } from '../block';
import { union, some, transform, trim } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { indexer, defineIndex } from './indexer';
import { inline } from '../inline';
import { compress, hasText } from '../util';
import { html } from 'typed-dom';

const syntax = /^(#{1,6})\s+([^\n]+)(?:\n|$)/;

export const heading: HeadingParser = block(line(source => {
  if (!source.startsWith('#')) return;
  const [whole = '', { length: level } = '', title = ''] = source.match(syntax) || [];
  if (!whole) return;
  assert(level > 0 && level < 7);
  return transform<HeadingParser>(compress(trim(some(union([indexer, inline])))), cs => {
    const el = html(`h${level}` as 'h1', cs);
    if (!hasText(el)) return;
    void defineIndex(el);
    return [[el], ''];
  })(title);
}, true, true));
