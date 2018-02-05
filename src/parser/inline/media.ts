import { MediaParser } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { text } from '../source/text';
import { escsource } from '../source/escapable';
import { parenthesis } from '../source/parenthesis';
import { match, isSingleLine } from '../source/validation';
import { sanitize } from '../string/url';
import { Cache } from 'spica/cache';
import { html } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(100);

const syntax = /^!\[[^\n]*?\]\(/;

export const media: MediaParser = source => {
  if (!match(source, '![', syntax)) return;
  return transform(
    bracket(
      '![',
      loop(combine<HTMLElement | Text, MediaParser.InnerParsers>([text]), /^]\n?|^\n/),
      ']'),
    (ns, rest) => {
      if (!isSingleLine(source.slice(0, source.length - rest.length).trim())) return;
      const caption = ns.reduce((s, c) => s + c.textContent, '').trim();
      return transform(
        bracket(
          '(',
          loop(combine<HTMLElement | Text, MediaParser.InnerParsers>([parenthesis, escsource]), /^\)|^\s/),
          ')'),
        (ns, rest) => {
          const url = sanitize(ns.reduce((s, c) => s + c.textContent, '').replace(/\\(.)/g, '$1'));
          if (url === '') return;
          if (cache.has(url)) return [[cache.get(url)!.cloneNode(true) as HTMLElement], rest];
          return [[html('img', { 'data-src': url, alt: caption })], rest];
        })
        (rest) as [[HTMLImageElement], string];
    })(source);
};
