import { Result, combine, loop, bracket } from '../../combinator';
import { MathInlineParser } from '../inline';
import { EscapableSourceParser } from '../source';
import { escsource } from '../source/escapable';
import { squash } from '../squash';
import { Cache } from 'spica/cache';

export const cache = new Cache<string, HTMLElement>(100); // for rerendering in editing

type SubParsers = [EscapableSourceParser];

const syntax = /^\$\S[^\n]*?\$(?!\d)/;
const closer = /^\$(?!\d)|^\n/;

export const math: MathInlineParser = function (source: string): Result<HTMLSpanElement, SubParsers> {
  if (!source.startsWith('$') || source.startsWith('$$') || source.search(syntax) !== 0) return;
  const [cs, rest] = bracket('$', loop(combine<SubParsers, Text>([escsource]), closer), '$')(source) || [[], ''];
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
