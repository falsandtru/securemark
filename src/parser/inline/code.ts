import { CodeParser } from '../inline';
import { List, Node } from '../../combinator/data/parser';
import { match } from '../../combinator';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

export const code: CodeParser = match(
  /(`+)(?!`)([^\n]*?)(?:((?<!`)\1(?!`))|(?=$|\n))/y,
  ([whole, opener, body, closer]) => () =>
    closer
      ? new List([new Node(html('code', { 'data-src': whole }, format(body)))])
      : body
        ? new List([new Node(html('code', {
            class: 'invalid',
            ...invalid('code', 'syntax', `Missing the closing symbol "${opener}"`)
          }, whole))])
        : new List([new Node(opener)]));

function format(text: string): string {
  return text.length > 2
      && text[0] === ' '
      && text[1] === '`'
      && text.at(-1) === ' '
    ? text.slice(1, -1)
    : text;
}
