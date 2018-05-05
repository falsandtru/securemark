import { MathParser } from '../block';
import { capture } from '../../combinator';
import { block } from '../source/block';
import { html } from 'typed-dom';

export const math: MathParser = block(capture(
  /^\$\$[^\S\n]*\n(?:[^\n]+\n)+?\$\$[^\S\n]*(?:\n|$)/,
  ([whole], rest) =>
    [[html('div', { class: 'math' }, whole.trim())], rest]));
