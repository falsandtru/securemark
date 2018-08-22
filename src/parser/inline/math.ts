import { MathParser } from '../inline';
import { union, some, fmap, surround, verify, subline } from '../../combinator';
import { escsource } from '../source/escapable';
import { stringify, compress, startsWithTightText } from '../util';
import { Cache } from 'spica/cache';
import { html, frag } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(20); // for rerendering in editing

export const math: MathParser = subline(verify(
  fmap(
    stringify(
      surround('$', compress(some(union([escsource]), '$')), /^\$(?![0-9])/)),
    ([body]) => {
      const source = `$${body}$`; // TODO: Should use String.prototype.trimEnd.
      if (cache.has(source)) return [cache.get(source)!.cloneNode(true)];
      const el = html('span', { class: 'math notranslate' }, source);
      void el.setAttribute('data-src', source);
      return [el];
    }),
  ([el]) => startsWithTightText(frag(el.textContent!.slice(1, -1)))));
