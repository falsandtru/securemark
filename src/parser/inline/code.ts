import { CodeParser } from '../inline';
import { validate, getBacktrack, setBacktrack, match } from '../../combinator';
import { Backtrack } from '../context';
import { html } from 'typed-dom/dom';

export const code: CodeParser = validate(
  ({ source, context }) =>
    source[0] === '`' &&
    !getBacktrack(context, [1 | Backtrack.linebracket], source, source.slice(1)),
  match(
    /^(`+)(?!`)(?:([^\n]*?[^`\n])\1(?!`))?/,
    ([whole, , body]) => ({ source, context }) =>
      body
        ? [[html('code', { 'data-src': whole }, format(body))], source.slice(whole.length)]
        : void setBacktrack(context, [2 | Backtrack.linebracket], source),
    true));

function format(text: string): string {
  assert(text.length > 0);
  return `${text[0]}${text.at(-1)}` === '  '
      && text.trimStart()
    ? text.slice(1, -1)
    : text;
}
