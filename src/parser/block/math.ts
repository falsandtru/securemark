import { Result } from '../../combinator/parser';
import { MathBlockParser } from '../block';
import { verifyBlockEnd } from './end';
import { MathTextParser } from '../text';

type SubParsers = [MathTextParser];

const syntax = /^\$\$[^\S\n]*\n(?:[^\n]*?\S[^\n]*\n)+?\$\$[^\S\n]*(?=\n|$)/;

export const math: MathBlockParser = verifyBlockEnd(function (source: string): Result<HTMLDivElement, SubParsers> {
  if (!source.startsWith('$$')) return;
  const [whole] = source.match(syntax) || ['', ''];
  if (!whole) return;
  const el = document.createElement('div');
  void el.setAttribute('class', 'math');
  void el.appendChild(document.createTextNode(whole));
  return [[el], source.slice(whole.length + 1)];
});
