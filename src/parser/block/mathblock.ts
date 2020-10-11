import { MathBlockParser } from '../block';
import { block, validate, fmap, clear, fence } from '../../combinator';
import { html } from 'typed-dom';

const opener = /^(\$\$)(?!\$)([^\n]*)(?:$|\n)/;

export const segment: MathBlockParser.SegmentParser = block(validate('$$',
  clear(fence(opener, 100, true))));

export const segment_: MathBlockParser.SegmentParser = block(validate('$$',
  clear(fence(opener, 100, false))), false);

export const mathblock: MathBlockParser = block(validate('$$', fmap(
  fence(opener, 100, true),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim, param]: string[]) =>
    closer && param.trimStart() === ''
      ? [html('div', { class: `math notranslate` }, `$$\n${body}$$`)]
      : [html('pre', {
          class: `math notranslate invalid`,
          'data-invalid-syntax': 'mathblock',
          'data-invalid-type': closer ? 'parameter' : 'closer',
          'data-invalid-message': closer ? 'Invalid parameter.' : `Missing closing delimiter ${delim}.`,
        }, `${opener}${body}${closer}`)])));
