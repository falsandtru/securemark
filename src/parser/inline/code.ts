import { CodeParser } from '../inline';
import { combine, some, bracket, transform } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { char } from '../source/char';
import { match, isVisible, isSingleLine } from '../source/validation';
import { html } from 'typed-dom';

const syntax = /^(`+)[^\n]+?\1(?!`)/;

export const code: CodeParser = source => {
  if (!match(source, '`')) return;
  const [whole = '', keyword = ''] = source.match(syntax) || [];
  if (!whole) return;
  return transform(
    bracket(
      keyword,
      some(combine<CodeParser>([some(char('`')), unescsource]), `^${keyword}(?!\`)|^\n`),
      keyword),
    (ns, rest) => {
      if (!isSingleLine(source.slice(0, source.length - rest.length))) return;
      const el = html('code', { 'data-src': source.slice(0, source.length - rest.length) }, ns.reduce((acc, n) => acc + n.textContent!, '').trim());
      if (!isVisible(el.textContent!)) return;
      return [[el], rest];
    })
    (source);
};
