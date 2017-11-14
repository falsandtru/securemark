import { MathBlockParser } from '../block';
import { verifyBlockEnd } from './end';

const syntax = /^\$\$[^\S\n]*\n(?:[^\n]*?\S[^\n]*\n)+?\$\$[^\S\n]*(?=\n|$)/;

export const mathblock: MathBlockParser = verifyBlockEnd((source: string): [[HTMLDivElement], string] | undefined => {
  if (!source.startsWith('$$')) return;
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  const el = document.createElement('div');
  void el.setAttribute('class', 'math');
  void el.appendChild(document.createTextNode(whole));
  return [[el], source.slice(whole.length + 1)];
});
