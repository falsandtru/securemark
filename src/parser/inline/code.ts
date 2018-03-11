import { CodeParser } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { line } from '../source/line';
import { unescsource } from '../source/unescapable';
import { char } from '../source/char';
import { hasText } from './util/verification';
import { html } from 'typed-dom';

const syntax = /^(`+)[^\n]+?\1(?!`)/;
const cache = new Map<string, RegExp>();

export const code: CodeParser = source => {
  const [whole = '', keyword = ''] = source.match(syntax) || [];
  if (!whole) return;
  const closer = cache.has(keyword)
    ? cache.get(keyword)!
    : cache.set(keyword, new RegExp(`^${keyword}(?!\`)`)).get(keyword)!;
  return transform(
    line(
      surround(
        keyword,
        some(combine<CodeParser>([some(char('`')), unescsource]), closer),
        closer),
      false,
      true),
    (ns, rest) => {
      const el = html('code', { 'data-src': source.slice(0, source.length - rest.length) }, ns.reduce((acc, n) => acc + n.textContent, '').trim());
      if (!hasText(el)) return;
      return [[el], rest];
    })
    (source);
};
