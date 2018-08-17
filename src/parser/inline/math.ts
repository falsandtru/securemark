import { MathParser } from '../inline';
import { union, some, fmap, surround, verify, subline } from '../../combinator';
import { escsource } from '../source/escapable';
import { hasTightStartText, stringify } from '../util';
import { Cache } from 'spica/cache';
import { html, frag } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(100); // for rerendering in editing

export const math: MathParser = subline(verify(fmap(
  surround('$', some(union([escsource]), '$'), /^\$(?!\d)/),
  ns => {
    const el = html('span', { class: 'math notranslate' }, `$${stringify(ns)}$`);
    if (cache.has(el.textContent!)) return [cache.get(el.textContent!)!.cloneNode(true)];
    void el.setAttribute('data-src', el.textContent!);
    return [el];
  }
), ([el]) => hasTightStartText(frag(el.textContent!.slice(1, -1)))));
