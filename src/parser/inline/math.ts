import { MathParser } from '../inline';
import { build, combine, some, surround, transform } from '../../combinator';
import { line } from '../source/line';
import { hasTightText } from './util/verification';
import { escsource } from '../source/escapable';
import { text } from '../util';
import { Cache } from 'spica/cache';
import { html } from 'typed-dom';

const closer = /^\$(?![$\d])/;

export const cache = new Cache<string, HTMLElement>(100); // for rerendering in editing

export const math: MathParser = line(transform(build(() =>
  surround('$', some(combine<MathParser>([escsource]), '$'), closer)),
  (ns, rest) => {
    const el = html('span', { class: 'math' }, `$${text(ns)}$`);
    if (cache.has(el.textContent!)) return [[cache.get(el.textContent!)!.cloneNode(true)], rest];
    if (!hasTightText(html('span', el.textContent!.slice(1, -1)))) return;
    void el.setAttribute('data-src', el.textContent!);
    return [[el], rest];
  }),
  false);
