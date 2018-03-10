import { CodeParser } from '../inline';
import { combine, some, bracket, transform } from '../../combinator';
import { line } from '../source/line';
import { unescsource } from '../source/unescapable';
import { char } from '../source/char';
import { match } from '../source/validation';
import { isVisible } from './util/verification';
import { html } from 'typed-dom';

const syntax = /^(`+)[^\n]+?\1(?!`)/;

export const code: CodeParser = source => {
  if (!match(source, '`')) return;
  const [whole = '', keyword = ''] = source.match(syntax) || [];
  if (!whole) return;
  return transform(
    line(
      bracket(
        keyword,
        some(combine<CodeParser>([some(char('`')), unescsource]), `^${keyword}(?!\`)|^\n`),
        keyword),
      false),
    (ns, rest) => {
      const el = html('code', { 'data-src': source.slice(0, source.length - rest.length) }, ns.reduce((acc, n) => acc + n.textContent, '').trim());
      if (!isVisible(el)) return;
      return [[el], rest];
    })
    (source);
};
