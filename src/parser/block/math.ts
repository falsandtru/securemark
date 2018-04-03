import { MathParser } from '../block';
import { match } from '../../combinator';
import { block } from '../source/block';
import { html } from 'typed-dom';

const syntax = /^\$\$[^\S\n]*\n(?:[^\n]+\n)+?\$\$[^\S\n]*(?:\n|$)/;

export const math: MathParser = block(match(syntax, ([whole], source) =>
  [[html('div', { class: 'math' }, whole.trim())], source.slice(whole.length)]));
