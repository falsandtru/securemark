import { MathParser } from '../block';
import { match } from '../../combinator';
import { block } from '../source/block';
import '../source/unescapable';
import { html } from 'typed-dom';

export const math: MathParser = block(match(
  /^\$\$[^\S\n]*\n(?:[^\n]+\n)+?\$\$[^\S\n]*(?:\n|$)/,
  ([whole], rest) =>
    [[html('div', { class: 'math' }, whole.trim())], rest]));
