import { MathParser } from '../inline';
import { union, some, subline, rewrite, verify, surround, convert } from '../../combinator';
import { escsource } from '../source/escapable';
import { hasText } from '../util';
import { Cache } from 'spica/cache';
import { html, text } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(20); // for rerendering in editing

export const math: MathParser = subline(verify(
  rewrite(
    surround('${', some(union<MathParser>([escsource]), /^}\$|^\n/), '}$'),
    convert(
      source => `\${${source.slice(2, -2).trim()}}$`,
      source => [
        cache.has(source)
          ? [cache.get(source)!.cloneNode(true)]
          : [html('span', { class: 'math notranslate', 'data-src': source }, source)],
        ''
      ])),
  ([el]) => hasText(text(el.textContent!.slice(2, -2)))));
