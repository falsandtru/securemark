import { MediaParser } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { text } from '../source/text';
import { escsource } from '../source/escapable';
import { parenthesis } from '../source/parenthesis';
import { match, isSingleLine } from '../source/validation';
import { sanitize } from '../string/url';
import { Cache } from 'spica/cache';

export const cache = new Cache<string, HTMLElement>(100);

const syntax = /^!\[[^\n]*?\]\n?\(/;

export const media: MediaParser = (source: string) => {
  if (!match(source, '![', syntax)) return;
  return transform(
    bracket(
      '![',
      loop(combine<HTMLElement | Text, MediaParser.InnerParsers>([text]), /^]\n?|^\n/),
      /^]\n?/),
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
          const el = document.createElement('img');
          void el.setAttribute('data-src', url);
          void el.setAttribute('alt', caption);
          return [[el], rest];
        })
        (rest) as [[HTMLImageElement], string];
    })(source);
};
