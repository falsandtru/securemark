import { CodeParser } from '../inline';
import { validate, isBacktrack, setBacktrack, match } from '../../combinator';
import { Backtrack } from '../context';
import { html } from 'typed-dom/dom';

export const code: CodeParser = validate(
  ({ source, context }) =>
    source[0] === '`' &&
    !isBacktrack(context, [1 | Backtrack.bracket], source),
  match(
    /^(`+)(?!`)([^\n]*?)(?:((?<!`)\1(?!`))|$|\n)/,
    ([whole, , body, closer]) => ({ source, context }) =>
      closer
        ? [[html('code', { 'data-src': whole }, format(body))], source.slice(whole.length)]
        : void setBacktrack(context, [2 | Backtrack.bracket], source.length),
    true));

function format(text: string): string {
  assert(text.length > 0);
  return `${text[0]}${text.at(-1)}` === '  '
      && text.trimStart()
    ? text.slice(1, -1)
    : text;
}
