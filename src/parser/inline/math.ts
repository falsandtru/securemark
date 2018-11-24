import { MathParser } from '../inline';
import { union, some, fmap, surround, verify, subline } from '../../combinator';
import { escsource } from '../source/escapable';
import { stringify, compress, hasText } from '../util';
import { Cache } from 'spica/cache';
import { html, frag } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(20); // for rerendering in editing

export const math: MathParser = subline(verify(
  fmap(
    stringify(
      surround('${', compress(some(union([escsource]), /^}\$|^\n/)), '}$')),
    ([body]) => {
      const source = `$\{${body.trim()}}$`;
      if (cache.has(source)) return [cache.get(source)!.cloneNode(true)];
      const el = html('span', { class: 'math notranslate' }, source);
      void el.setAttribute('data-src', source);
      return [el];
    }),
  ([el]) => hasText(frag(el.textContent!.slice(2, -2)))));
