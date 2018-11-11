import { MathBlockParser } from '../block';
import { match, block, focus, rewrite, lazy } from '../../combinator';
import '../source/unescapable';
import { html } from 'typed-dom';

export const segment: MathBlockParser = block(lazy(() => segment_));

export const segment_: MathBlockParser = block(focus(
  /^\$\$(?!\$)([^\n]*)(\n(?:[^\n]*\n)*?)\$\$[^\S\n]*(?:\n|$)/,
  _ => [[], '']), false);

export const mathblock: MathBlockParser = block(rewrite(segment, match(
  /^\$\$(?!\$)([^\n]*)(\n(?:[^\n]*\n)*?)\$\$\s*$/,
  ([, arg, body], rest) => {
    const el = html('div', { class: `math notranslate` }, `$$${body}$$`);
    if (arg.trim() !== '') {
      void el.classList.add('invalid');
      void el.setAttribute('data-invalid-type', 'parameter');
    }
    return [[el], rest];
  })));
