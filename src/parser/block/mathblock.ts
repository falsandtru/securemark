import { MathBlockParser } from '../block';
import { block, validate, fence, clear, fmap } from '../../combinator';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

const opener = /^(\${2,})(?!\$)([^\n]*)(?:$|\n)/;

export const segment: MathBlockParser.SegmentParser = block(validate('$$',
  clear(fence(opener, 300))));

export const segment_: MathBlockParser.SegmentParser = block(validate('$$',
  clear(fence(opener, 300, false))), false);

export const mathblock: MathBlockParser = block(validate('$$', fmap(
  fence(opener, 300),
  // Bug: Type mismatch between outer and inner.
  ([body, overflow, closer, opener, delim, param]: string[], { caches: { math: cache = undefined } = {} }) => [
    delim.length === 2 && closer && !overflow && param.trimStart() === ''
      ? cache?.get(`${delim}\n${body}${delim}`)?.cloneNode(true) as HTMLDivElement ||
        html('div', { class: 'math', translate: 'no' }, `${delim}\n${body}${delim}`)
      : html('pre', {
          class: 'invalid',
          translate: 'no',
          ...invalid(
            'mathblock',
            delim.length > 2 ? 'syntax' : !closer || overflow ? 'fence' : 'argument',
            delim.length > 2 ? 'Invalid syntax' :
              !closer ? `Missing the closing delimiter "${delim}"` :
                overflow ? `Invalid trailing line after the closing delimiter "${delim}"` :
                  'Invalid argument'),
        }, `${opener}${body}${overflow || closer}`),
  ])));
