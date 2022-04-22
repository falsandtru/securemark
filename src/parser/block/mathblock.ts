import { undefined } from 'spica/global';
import { MathBlockParser } from '../block';
import { block, validate, fence, clear, fmap } from '../../combinator';
import { html } from 'typed-dom/dom';

const opener = /^(\${2,})(?!\$)([^\n]*)(?:$|\n)/;

export const segment: MathBlockParser.SegmentParser = block(validate('$$',
  clear(fence(opener, 100))));

export const segment_: MathBlockParser.SegmentParser = block(validate('$$',
  clear(fence(opener, 100, false))), false);

export const mathblock: MathBlockParser = block(validate('$$', fmap(
  fence(opener, 100),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim, param]: string[], _, { caches: { math: cache = undefined } = {} }) => [
    delim.length === 2 && closer && param.trimStart() === ''
      ? cache?.get(`${delim}\n${body}${delim}`)?.cloneNode(true) as HTMLDivElement ||
        html('div', { class: 'math', translate: 'no' }, `${delim}\n${body}${delim}`)
      : html('pre', {
          class: 'invalid',
          translate: 'no',
          'data-invalid-syntax': 'mathblock',
          'data-invalid-type': delim.length > 2 ? 'syntax' : !closer ? 'fence' : 'argument',
          'data-invalid-message': delim.length > 2 ? 'Invalid syntax' : !closer ? `Missing the closing delimiter "${delim}"` : 'Invalid argument',
        }, `${opener}${body}${closer}`),
  ])));
