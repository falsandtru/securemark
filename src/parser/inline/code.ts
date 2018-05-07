import { CodeParser } from '../inline';
import { union, some, match, surround, bind } from '../../combinator';
import { line } from '../source/line';
import { unescsource } from '../source/unescapable';
import { char } from '../source/char';
import { hasText, stringify } from '../util';
import { html } from 'typed-dom';

const cache = new Map<string, RegExp>();

export const code: CodeParser = line(match(
  /^(`+)[^\n]+?\1(?!`)/,
  ([whole, bracket], source) => {
    source = whole + source;
    const closer = cache.has(bracket)
      ? cache.get(bracket)!
      : cache.set(bracket, new RegExp(`^${bracket}(?!\`)`)).get(bracket)!;
    return bind(
      surround(bracket, some(union([some(char('`')), unescsource]), closer), closer),
      (ns, rest) => {
        const el = html('code',
          { 'data-src': source.slice(0, source.length - rest.length) },
          stringify(ns).trim());
        return hasText(el)
          ? [[el], rest]
          : undefined;
      })
      (source);
  }
), false);
