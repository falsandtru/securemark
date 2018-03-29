import { CodeParser } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { line } from '../source/line';
import { unescsource } from '../source/unescapable';
import { char } from '../source/char';
import { hasText, stringify } from '../util';
import { html } from 'typed-dom';

const syntax = /^(`+)[^\n]+?\1(?!`)/;
const cache = new Map<string, RegExp>();

export const code: CodeParser = line(source => {
  const [whole = '', keyword = ''] = source.match(syntax) || [];
  if (!whole) return;
  const closer = cache.has(keyword)
    ? cache.get(keyword)!
    : cache.set(keyword, new RegExp(`^${keyword}(?!\`)`)).get(keyword)!;
  return transform(
    surround(keyword, some(combine<CodeParser>([some(char('`')), unescsource]), closer), closer),
    (ns, rest) => {
      const el = html('code',
        { 'data-src': source.slice(0, source.length - rest.length) },
        stringify(ns).trim());
      return hasText(el)
        ? [[el], rest]
        : undefined;
    })
    (source);
}, false);
