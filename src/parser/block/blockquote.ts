﻿import { BlockquoteParser } from '../block';
import { Parser, union, some, surround, fmap, rewrite, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import '../source/unescapable';
import { isFixed } from '../inline';
import { parse } from '../api/parse';
import { html, text } from 'typed-dom';

export const blockquote: BlockquoteParser = block(build(() => union([
  surround(/^(?=(>+)\s)/, textquote, ''),
  surround(/^!(?=(>+)\s)/, fmap(mdquote, es => es.map(suppress)), ''),
])));

const opener = /^(?=>>+(?:\s|$))/;

const textquote: Parser<HTMLQuoteElement, any> = fmap(build(() =>
  some(union([
    rewrite(
      indent,
      s => textquote(unindent(s))),
    fmap(
      some(line(s => [[text(unindent(s.split('\n')[0].replace(/ /g, String.fromCharCode(160)))), html('br')], ''], true, true), opener),
      ns => ns.slice(0, -1)),
  ]))),
  ns => [html('blockquote', ns)]);

const mdquote: Parser<HTMLQuoteElement, any> = fmap(build(() =>
  some(union([
    rewrite(
      indent,
      s => mdquote(unindent(s))),
    rewrite(
      some(line(s => [[s], ''], true, true), opener),
      s => [[parse(unindent(s))], '']),
  ]))),
  ns => [html('blockquote', ns)]);

const indent = block(surround(opener, some(line(s => [[s], ''], true, true), /^>(?:\s|$)/), ''), false);

function unindent(source: string): string {
  return source.replace(/^>(?:$|\s)|^>(?=>*(?:$|\s))/mg, '');
}

export function suppress<T extends HTMLElement>(target: T): T {
  void target.querySelectorAll('[id]')
    .forEach(el =>
      !el.closest('.math') &&
      void el.removeAttribute('id'));
  void target.querySelectorAll('figure[class^="label:"]:not([data-index])')
    .forEach(el =>
      !isFixed(el.className) &&
      void el.setAttribute('class', el.getAttribute('class')!.split('-')[0] + '-0'));
  void target.querySelectorAll('a[href^="#"]')
    .forEach(el =>
      void el.setAttribute('onclick', 'return false;'));
  return target;
}
