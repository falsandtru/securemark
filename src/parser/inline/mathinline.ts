import { MathInlineParser } from '../inline';
import { combine, loop, bracket } from '../../combinator';
import { escsource } from '../source/escapable';
import { squash } from '../squash';
import { validate } from '../source/validation';
import { Cache } from 'spica/cache';

export const cache = new Cache<string, HTMLElement>(100); // for rerendering in editing

const syntax = /^\$\S[^\n]*?\$(?!\d)/;
const closer = /^\$(?!\d)|^\n/;

export const mathinline: MathInlineParser = function (source: string): [[HTMLSpanElement], string] | undefined {
  if (source.startsWith('$$')) return;
  if (!validate(source, '$', syntax)) return;
  const [cs, rest] = bracket('$', loop(combine<Text, MathInlineParser.InnerParsers>([escsource]), closer), '$')(source) || [[], ''];
  if (rest === source) return;
  const el = document.createElement('span');
  void el.setAttribute('class', 'math');
  void el.appendChild(squash([document.createTextNode('$'), ...cs, document.createTextNode('$')]));
  assert(el.textContent!.slice(1, -1).trim() !== '');
  if (el.textContent!.slice(1, -1) !== el.textContent!.slice(1, -1).trim()) return;
  if (cache.has(el.textContent!)) return [[cache.get(el.textContent!)!.cloneNode(true) as HTMLSpanElement], rest.slice(1)];
  void el.setAttribute('data-src', el.textContent!);
  return [[el], rest.slice(1)];
};
