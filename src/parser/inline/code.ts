import { CodeParser } from '../inline';
import { validate, creation, backtrack, match } from '../../combinator';
import { html, text } from 'typed-dom';

export const code: CodeParser = creation(validate('`', backtrack(match(
  /^(`+)(?!`)(?:([^\n]*?[^`\n])\1(?!`))?/,
  ([whole, , body]) => rest =>
    body
      ? [[html('code', { 'data-src': whole }, body.trim() || body)], rest]
      : [[text(whole)], rest]))));
