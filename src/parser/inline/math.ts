import { MathParser } from '../inline';
import { combine, some, bracket, transform } from '../../combinator';
import { escsource } from '../source/escapable';
import { match, isTightVisible, isSingleLine } from '../source/validation';
import { Cache } from 'spica/cache';
import { html } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(100); // for rerendering in editing

const syntax = /^\$[^\s$][^\n]*?\$(?!\d)/;
const closer = /^\$|^\n/;

export const math: MathParser = source => {
  if (!match(source, '$', syntax)) return;
  return transform(
    bracket(
      '$',
      some(combine<MathParser>([escsource]), closer),
      /^\$(?![$\d])/),
    (ns, rest) => {
      if (!isTightVisible(source.slice(1, source.length - rest.length - 1))) return;
      if (!isSingleLine(source.slice(0, source.length - rest.length))) return;
      const el = html('span', { class: 'math' }, `$${ns.reduce((acc, n) => acc + n.textContent!, '')}$`);
      if (cache.has(el.textContent!)) return [[cache.get(el.textContent!)!.cloneNode(true)], rest];
      void el.setAttribute('data-src', el.textContent!);
      return [[el], rest];
    })
    (source);
};
