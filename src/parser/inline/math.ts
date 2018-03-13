import { MathParser } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { line } from '../source/line';
import { hasTightText } from './util/verification';
import { escsource } from '../source/escapable';
import { Cache } from 'spica/cache';
import { html } from 'typed-dom';

const closer = /^\$(?![$\d])/;

export const cache = new Cache<string, HTMLElement>(100); // for rerendering in editing

export const math: MathParser = line(source =>
  transform(
    surround('$', some(combine<MathParser>([escsource]), '$'), closer),
    (ns, rest) => {
      const el = html('span', { class: 'math' }, `$${ns.reduce((acc, n) => acc + n.textContent, '')}$`);
      if (cache.has(el.textContent!)) return [[cache.get(el.textContent!)!.cloneNode(true)], rest];
      if (!hasTightText(html('span', el.textContent!.slice(1, -1)))) return;
      void el.setAttribute('data-src', el.textContent!);
      return [[el], rest];
    })
    (source),
  false);
