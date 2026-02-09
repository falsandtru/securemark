import { CodeParser } from '../inline';
import { match } from '../../combinator';
import { html } from 'typed-dom/dom';

export const code: CodeParser = match(
  /^(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/,
  ([whole, , body]) => ({ source }) =>
    [[html('code', { 'data-src': whole }, format(body))], source.slice(whole.length)],
  true);

function format(text: string): string {
  assert(text.length > 0);
  return `${text[0]}${text.at(-1)}` === '  '
      && text.trimStart()
    ? text.slice(1, -1)
    : text;
}
