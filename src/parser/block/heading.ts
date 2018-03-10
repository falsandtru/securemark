import { HeadingParser } from '../block';
import { combine, some, transform } from '../../combinator';
import { verify } from './util/verification';
import { line } from '../source/line';
import { indexer, defineIndex } from './util/indexer';
import { inline } from '../inline';
import { html } from 'typed-dom';

const syntax = /^(#{1,6})\s+([^\n]+)\n?$/;

export const heading: HeadingParser = verify(line(source => {
  if (!source.startsWith('#')) return;
  const [whole = '', { length: level } = '', title = ''] = source.match(syntax) || [];
  if (!whole) return;
  assert(level > 0 && level < 7);
  assert(title.length > 0);
  return transform(some(combine<HeadingParser>([indexer, inline])), cs => {
    const el = html(`h${level}` as 'h1', cs);
    void defineIndex(el);
    return [[el], ''];
  })(title.trim());
}, true, true));
