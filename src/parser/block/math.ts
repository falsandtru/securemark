import { MathParser } from '../block';
import { match, block, focus, rewrite, build } from '../../combinator';
import '../source/unescapable';
import { html } from 'typed-dom';

export const segment: MathParser = block(build(() => segment_));

export const segment_: MathParser = block(focus(
  /^\$\$([^\n]*)(\n(?:[^\n]*\n)*?)\$\$[^\S\n]*(?:\n|$)/,
  _ => [[], '']), false);

export const math: MathParser = block(rewrite(segment, match(
  /^\$\$([^\n]*)(\n(?:[^\n]*\n)*?)\$\$\s*$/,
  ([, arg, body], rest) =>
    [[html('div', { class: `math notranslate ${arg.trim() ? 'invalid' : ''}`.trim() }, `$$${body}$$`)], rest])));
