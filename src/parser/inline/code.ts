import { CodeParser } from '../inline';
import { union, some, subline, focus, match } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { html } from 'typed-dom';

export const code: CodeParser = subline(union([
  match(
    /^(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/,
    ([whole, , body]) => rest =>
      [[html('code', { 'data-src': whole }, body.trim() || body)], rest]),
  focus(/^`+/, some(unescsource)),
]));
