import { Result } from '../../combinator/parser';
import { MathBlockParser, verifyBlockEnd } from '../block';
import { MathTextParser } from '../text';

type SubParsers = [MathTextParser];

const syntax = /^\$\$[^\S\n]*\n(?:[^\n]*?\S[^\n]*\n)+?\$\$[^\S\n]*(?=\n|$)/;

export const math: MathBlockParser = function (source: string): Result<HTMLDivElement, SubParsers> {
  if (!source.startsWith('$$')) return;
  const [whole] = source.match(syntax) || ['', ''];
  if (!whole) return;
  const el = document.createElement('div');
  void el.setAttribute('class', 'math');
  void el.appendChild(document.createTextNode(whole));
  return verifyBlockEnd<HTMLDivElement, SubParsers>([el], source.slice(whole.length + 1));
};
