import { CodeParser } from '../inline';
import { combine, loop, bracket } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { backquote } from '../source/backquote';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^(`+)[^\n]+?\1/;

export const code: CodeParser = function (source: string): [[HTMLElement], string] | undefined {
  if (!validate(source, '`')) return;
  const [whole, keyword] = source.match(syntax) || ['', ''];
  if (!whole) return;
  const [cs, rest] = bracket(
    keyword,
    loop(combine<Text, CodeParser.InnerParsers>([loop(backquote), unescsource]), `^${keyword}(?!\`)`),
    keyword,
  )(source) || [[], source];
  if (rest === source) return;
  const el = document.createElement('code');
  void el.appendChild(squash(cs));
  el.textContent = el.textContent!.trim();
  if (el.textContent! === '') return;
  void el.setAttribute('data-src', source.slice(0, source.length - rest.length));
  return [[el], rest];
};
