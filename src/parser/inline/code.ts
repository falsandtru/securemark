import { CodeParser } from '../inline';
import { union, some, subline, match } from '../../combinator';
import { char } from '../source';
import { html } from 'typed-dom';

export const code: CodeParser = subline(union([
  match(
    /^(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/,
    ([whole, , body]) => rest =>
      [[html('code', { 'data-src': whole }, body.trim() || body)], rest]),
  some(char('`')),
]));
