import { Result } from '../../parser';
import { MathInlineParser } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { MathTextParser, squash } from '../text';
import { mathtext } from '../text/mathtext';

type SubParsers = [MathTextParser];

const syntax = /^\$(\S[^\n]*?)\$(?!\d)/;
const closer = /^\$(?!\d)|^\n/;

export const mathinline: MathInlineParser = function (source: string): Result<HTMLSpanElement, SubParsers> {
  if (!source.startsWith('$') || source.search(syntax) !== 0) return;
  const [cs, rest] = loop(combine<SubParsers, Text>([mathtext]), closer)(source.slice(1)) || [[], ''];
  if (!rest.startsWith('$')) return;
  const el = document.createElement('span');
  void el.setAttribute('class', 'math');
  void el.appendChild(squash([document.createTextNode('$'), ...cs, document.createTextNode('$')]));
  if (el.textContent!.slice(1, -1).trim() === '') return;
  if (el.textContent!.slice(1, -1) !== el.textContent!.slice(1, -1).trim()) return;
  return [[el], rest.slice(1)];
};
