import { ReplyParser } from '../../block';
import { union, tails, creation, line, validate, focus, reverse, fmap } from '../../../combinator';
import { anchor } from '../../inline/autolink/anchor';
import { str } from '../../source';
import { html, define, defrag } from 'typed-dom/dom';

export const cite: ReplyParser.CiteParser = creation(line(fmap(validate(
  '>>',
  reverse(tails([
    str(/^>*(?=>>[^>\s]+[^\S\n]*(?:$|\n))/),
    union([
      anchor,
      // Subject page representation.
      // リンクの実装は後で検討
      focus(/^>>\.[^\S\n]*(?:$|\n)/, () => [[html('a', { class: 'anchor' }, '>>.')], '']),
      focus(/^>>#\S*[^\S\n]*(?:$|\n)/, source => [[html('a', { class: 'anchor' }, source)], '']),
    ]),
  ]))),
  ([el, quotes = '']: [HTMLElement, string?]) => [
    html('span', { class: 'cite' }, defrag([
      `${quotes}>`,
      define(el, { 'data-depth': `${quotes.length + 1}` }, el.innerText.slice(1)),
    ])),
    html('br'),
  ])));
