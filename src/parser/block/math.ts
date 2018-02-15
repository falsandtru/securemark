import { MathParser } from '../block';
import { verify } from './util/verification';
import { html } from 'typed-dom';

const syntax = /^\$\$[^\S\n]*\n(?:[^\n]*?\S[^\n]*\n)+?\$\$[^\S\n]*(?:\n|$)/;

export const math: MathParser = verify(source => {
  if (!source.startsWith('$$')) return;
  const [whole = ''] = source.match(syntax) || [];
  if (!whole) return;
  return [[html('div', { class: 'math' }, whole)], source.slice(whole.length)];
});
