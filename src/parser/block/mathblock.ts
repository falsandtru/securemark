import { MathBlockParser } from '../block';
import { block, validate, clear, fence, fmap } from '../../combinator';
import { html } from 'typed-dom';

const opener = /^(\$\$)(?!\$)([^\n]*)\n?/;

export const segment: MathBlockParser.SegmentParser = block(validate('$$',
  clear(fence(opener, 100, true))));

export const segment_: MathBlockParser.SegmentParser = block(validate('$$',
  clear(fence(opener, 100, false))), false);

export const mathblock: MathBlockParser = block(validate('$$', fmap(
  fence(opener, 100, true),
  // Bug: Remove the annotation.
  ([body, closer, opener, , param]: string[]) =>
    closer && param.trim() === ''
      ? [html('div', { class: `math notranslate` }, `$$\n${body}$$`)]
      : [html('pre', {
          class: 'math notranslate invalid',
          'data-invalid-syntax': 'math',
          'data-invalid-message': `Invalid ${closer ? 'parameter' : 'content'}`,
        }, `${opener}${body}${closer}`)])));
