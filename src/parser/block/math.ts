import { MathParser } from '../block';
import { block } from '../source/block';
import { html } from 'typed-dom';

const syntax = /^\$\$[^\S\n]*\n(?:[^\n]*?\S[^\n]*\n)+?\$\$[^\S\n]*(?:\n|$)/;

export const math: MathParser = block(source => {
  if (!source.startsWith('$$')) return;
  const [whole = ''] = source.match(syntax) || [];
  if (!whole) return;
  return [[html('div', { class: 'math' }, whole.trim())], source.slice(whole.length)];
});
