import { MediaParser } from '../inline';
import { combine, some, bracket, transform } from '../../combinator';
import { line } from '../source/line';
import { text } from '../source/text';
import { escsource } from '../source/escapable';
import { parenthesis } from '../source/parenthesis';
import { match } from '../source/validation';
import { sanitize } from '../string/url';
import { Cache } from 'spica/cache';
import { html } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(100);

const syntax = /^!\[[^\n]*?\]\(/;

export const media: MediaParser = source => {
  if (!match(source, '![', syntax)) return;
  return transform(
    line(bracket('![', some(combine<MediaParser>([text]), /^\]/), ']'), false),
    (ns, rest) => {
      const caption = ns.reduce((s, c) => s + c.textContent, '').trim();
      return transform(
        line(bracket('(', some(combine<MediaParser>([parenthesis, escsource]), /^\)|^\s/), ')'), false),
        (ns, rest) => {
          const url = sanitize(ns.reduce((s, c) => s + c.textContent, '').replace(/\\(.)/g, '$1'));
          if (url === '') return;
          if (cache.has(url)) return [[cache.get(url)!.cloneNode(true)], rest];
          return [[html('img', { class: 'media', 'data-src': url, alt: caption })], rest];
        })
        (rest);
    })(source);
};
