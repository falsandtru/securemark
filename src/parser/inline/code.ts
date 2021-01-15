import { CodeParser } from '../inline';
import { validate, creator, match } from '../../combinator';
import { html } from 'typed-dom';

export const code: CodeParser = creator(validate('`', '`', '\n', match(
  /^(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/,
  ([whole, , body]) => rest =>
    [[html('code', { 'data-src': whole }, format(body))], rest])));

function format(text: string): string {
  assert(text.length > 0);
  return `${text[0]}${text[text.length - 1]}`.trim()
    ? text
    : text.trim() || text;
}
