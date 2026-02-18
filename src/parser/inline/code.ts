import { CodeParser } from '../inline';
import { open, match } from '../../combinator';
import { Backtrack } from '../context';
import { html } from 'typed-dom/dom';

export const code: CodeParser = open(
  /^(?=`)/,
  match(
    /^(`+)(?!`)([^\n]*?)(?:((?<!`)\1(?!`))|$|\n)/,
    ([whole, , body, closer]) => () =>
      closer
        ? [[html('code', { 'data-src': whole }, format(body))]]
        : undefined,
    true),
  false,
  [3 | Backtrack.bracket]);

function format(text: string): string {
  return text.length > 2
      && text[0] === ' '
      && text[1] === '`'
      && text.at(-1) === ' '
    ? text.slice(1, -1)
    : text;
}
