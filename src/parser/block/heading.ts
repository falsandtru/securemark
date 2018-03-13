import { HeadingParser } from '../block';
import { combine, some, transform } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { hasText } from '../inline/util/verification';
import { indexer, defineIndex } from './indexer';
import { inline } from '../inline';
import { squash } from '../util';
import { html } from 'typed-dom';

const syntax = /^(#{1,6})\s+([^\n]+)(?:\n|$)/;

export const heading: HeadingParser = block(line(source => {
  if (!source.startsWith('#')) return;
  const [whole = '', { length: level } = '', title = ''] = source.match(syntax) || [];
  if (!whole) return;
  assert(level > 0 && level < 7);
  return transform(some(combine<HeadingParser>([indexer, inline])), cs => {
    const el = html(`h${level}` as 'h1', squash(cs));
    if (!hasText(el)) return;
    void defineIndex(el);
    return [[el], ''];
  })(title.trim());
}, true, true));
