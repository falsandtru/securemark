import { MathInlineParser } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { escsource } from '../source/escapable';
import { squash } from '../squash';
import { match } from '../source/validation';
import { Cache } from 'spica/cache';

export const cache = new Cache<string, HTMLElement>(100); // for rerendering in editing

const syntax = /^\$\S[^\n]*?\$(?!\d)/;
const closer = /^\$(?!\d)|^\n/;

export const mathinline: MathInlineParser = (source: string) => {
  if (source.startsWith('$$')) return;
  if (!match(source, '$', syntax)) return;
  return transform(
    bracket(
      '$',
      loop(combine<Text, MathInlineParser.InnerParsers>([escsource]), closer),
      '$'),
    (ns, rest) => {
      const el = document.createElement('span');
      void el.setAttribute('class', 'math');
      void el.appendChild(squash([document.createTextNode('$'), ...ns, document.createTextNode('$')]));
      assert(el.textContent!.slice(1, -1).trim() !== '');
      if (el.textContent!.slice(1, -1) !== el.textContent!.slice(1, -1).trim()) return;
      if (cache.has(el.textContent!)) return [[cache.get(el.textContent!)!.cloneNode(true) as HTMLSpanElement], rest];
      void el.setAttribute('data-src', el.textContent!);
      return [[el], rest];
    })
    (source);
};
