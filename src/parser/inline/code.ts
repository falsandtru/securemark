import { CodeParser } from '../inline';
import { match, subline } from '../../combinator';
import '../source/unescapable';
import { html } from 'typed-dom';

export const code: CodeParser = subline(match(
  /^(`+)([^\n]*?[^`\n])\1(?!`)/,
  ([whole, , body], rest) =>
    [[html('code', { 'data-src': whole }, body.trim() || body)], rest]));
