import { CodeParser } from '../inline';
import { validate, creator, match } from '../../combinator';
import { html } from 'typed-dom/dom';

export const code: CodeParser = creator(validate('`', match(
  /^(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/,
  ([whole, , body]) => rest =>
    [[html('code', { 'data-src': whole }, format(body))], rest.slice(whole.length)])));

function format(text: string): string {
  assert(text.length > 0);
  return `${text[0]}${text[text.length - 1]}` === '  '
      && text.trimStart()
    ? text.slice(1, -1)
    : text;
}
