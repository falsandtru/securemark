import { MathBlockParser } from '../block';
import { block, rewrite, focus, match, trim, lazy } from '../../combinator';
import '../source/unescapable';
import { html, define } from 'typed-dom';

export const segment: MathBlockParser = lazy(() => block(segment_));

export const segment_: MathBlockParser = block(focus(
  /^(\$\$)(?!\$)([^\n]*)(\n(?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$)/,
  _ => [[], '']), false);

export const mathblock: MathBlockParser = block(rewrite(segment, trim(match(
  /^(\$\$)(?!\$)([^\n]*)(\n(?:[^\n]*\n)*?)\1$/,
  ([, , param, body]) => rest => {
    const el = html('div', { class: `math notranslate` }, `$$${body}$$`);
    if (param.trim() !== '') {
      void el.classList.add('invalid');
      void define(el, {
        'data-invalid-syntax': 'math',
        'data-invalid-type': 'parameter',
      });
    }
    return [[el], rest];
  }))));
