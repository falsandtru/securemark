import { MathBlockParser } from '../block';
import { block, rewrite, focus, match, trim, lazy } from '../../combinator';
import { html, define } from 'typed-dom';

export const segment: MathBlockParser.SegmentParser = lazy(() => block(segment_));

export const segment_: MathBlockParser.SegmentParser = block(focus(
  /^(\$\$)(?!\$)([^\n]*)(\n(?:[^\n]*\n){0,100}?)\1[^\S\n]*(?:\n|$)/,
  () => [[], '']), false);

export const mathblock: MathBlockParser = block(rewrite(segment, trim(match(
  /^(\$\$)(?!\$)([^\n]*)(\n[\s\S]*)\1$/,
  ([, , param, body]) => rest => {
    const el = html('div', { class: `math notranslate` }, `$$${body}$$`);
    if (param.trim() !== '') {
      void define(el, {
        class: [...el.classList, 'invalid'].join(' '),
        'data-invalid-syntax': 'math',
        'data-invalid-type': 'parameter',
      });
    }
    return [[el], rest];
  }))));
