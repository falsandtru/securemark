import { MediaParser } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { text } from '../source/text';
import { escsource } from '../source/escapable';
import { match, isSingleLine } from '../source/validation';
import { sanitize } from '../string/url';
import DOM from 'typed-dom';
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
          loop(escsource, /^\)|^\s/),
          ')'),
        (ns, rest) => {
          const url = sanitize(ns.reduce((s, c) => s + c.textContent, '').replace(/\\(.)/g, '$1'));
          if (url === '') return;
          if (cache.has(url)) return [[cache.get(url)!.cloneNode(true) as HTMLImageElement], rest];
          const el = DOM.img({
            'data-src': url,
            alt: caption,
          }).element;
          return [[el], rest];
        })
        (rest) as [[HTMLImageElement], string];
    })(source);
};
