import { MathParser } from '../inline';
import { union, some, surround, transform } from '../../combinator';
import { line } from '../source/line';
import { escsource } from '../source/escapable';
import { hasTightText, stringify } from '../util';
import { Cache } from 'spica/cache';
import { html } from 'typed-dom';

const closer = /^\$(?![$\d])/;

export const cache = new Cache<string, HTMLElement>(100); // for rerendering in editing

export const math: MathParser = line(transform(
  surround('$', some(union<MathParser>([escsource]), '$'), closer),
  (ns, rest) => {
    const el = html('span', { class: 'math' }, `$${stringify(ns)}$`);
    if (cache.has(el.textContent!)) return [[cache.get(el.textContent!)!.cloneNode(true)], rest];
    if (!hasTightText(html('span', el.textContent!.slice(1, -1)))) return;
    void el.setAttribute('data-src', el.textContent!);
    return [[el], rest];
  }
), false);
