import { MathParser } from '../block';
import { match, rewrite, build } from '../../combinator';
import { block } from '../source/block';
import '../source/unescapable';
import { html } from 'typed-dom';

export const segment: MathParser = block(build(() => segment_));

export const segment_: MathParser = block(match(
  /^\$\$[^\n]*(\n(?:[^\n]*\n)*?)\$\$[^\S\n]*(?:\n|$)/,
  (_, rest) => [[], rest]), false);

export const math: MathParser = block(rewrite(segment, match(
  /^\$\$[^\n]*(\n(?:[^\n]*\n)*?)\$\$\s*$/,
  ([, body], rest) =>
    [[html('div', { class: 'math notranslate' }, `$$${body}$$`)], rest])));
