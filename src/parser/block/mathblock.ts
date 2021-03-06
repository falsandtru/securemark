import { undefined } from 'spica/global';
import { MathBlockParser } from '../block';
import { block, validate, fence, clear, fmap } from '../../combinator';
import { html } from 'typed-dom';

const opener = /^(\$\$)(?!\$)([^\n]*)(?:$|\n)/;

export const segment: MathBlockParser.SegmentParser = block(validate('$$',
  clear(fence(opener, 100))));

export const segment_: MathBlockParser.SegmentParser = block(validate('$$',
  clear(fence(opener, 100, false))), false);

export const mathblock: MathBlockParser = block(validate('$$', fmap(
  fence(opener, 100),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim, param]: string[], _, { caches: { math: cache = undefined } = {} }) => [
    closer && param.trimStart() === ''
      ? (body = `$$\n${body}$$`) && cache?.has(body)
        ? cache.get(body)!.cloneNode(true) as HTMLDivElement
        : html('div', { class: `math notranslate` }, body)
      : html('pre', {
          class: `math notranslate invalid`,
          'data-invalid-syntax': 'mathblock',
          'data-invalid-type': closer ? 'argument' : 'closer',
          'data-invalid-description': closer ? 'Invalid argument.' : `Missing the closing delimiter ${delim}.`,
        }, `${opener}${body}${closer}`),
  ])));
