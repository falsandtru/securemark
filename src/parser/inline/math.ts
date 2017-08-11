import { Result } from '../../combinator/parser';
import { MathInlineParser } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { MathTextParser, squash } from '../text';
import { mathtext } from '../text/mathtext';
import { Cache } from 'spica/cache';

export const cache = new Cache<string, HTMLElement>(100); // for rerendering in editing

type SubParsers = [MathTextParser];

const syntax = /^\$(\S[^\n]*?)\$(?!\d)/;
const closer = /^\$(?!\d)|^\n/;

export const math: MathInlineParser = function (source: string): Result<HTMLSpanElement, SubParsers> {
  if (!source.startsWith('$') || source.search(syntax) !== 0) return;
  const [cs, rest] = loop(combine<SubParsers, Text>([mathtext]), closer)(source.slice(1)) || [[], ''];
  if (!rest.startsWith('$')) return;
  const el = document.createElement('span');
  void el.setAttribute('class', 'math');
  void el.appendChild(squash([document.createTextNode('$'), ...cs, document.createTextNode('$')]));
  assert(el.textContent!.slice(1, -1).trim() !== '');
  if (el.textContent!.slice(1, -1) !== el.textContent!.slice(1, -1).trim()) return;
  if (cache.has(el.textContent!)) return [[<HTMLSpanElement>cache.get(el.textContent!)!.cloneNode(true)], rest.slice(1)];
  void el.setAttribute('data-src', el.textContent!);
  return [[el], rest.slice(1)];
};
