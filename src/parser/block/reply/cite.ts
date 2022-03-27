import { ReplyParser } from '../../block';
import { union, tails, line, validate, focus, creator, reverse, fmap } from '../../../combinator';
import { anchor } from '../../inline/autolink/anchor';
import { str } from '../../source';
import { html, define, defrag } from 'typed-dom';

export const cite: ReplyParser.CiteParser = creator(line(fmap(validate(
  '>>',
  reverse(tails([
    str(/^>*(?=>>[^>\s]+[^\S\n]*(?:$|\n))/),
    union([
      anchor,
      // Subject page representation.
      // リンクの実装は後で検討
      focus(/^>>\.[^\S\n]*(?:$|\n)/, () => [[html('a', { class: 'anchor' }, '>>.')], '']),
    ]),
  ]))),
  ([el, quotes = '']: [HTMLElement, string?]) => [
    html('span', { class: 'cite' }, defrag([
      `${quotes}>`,
      define(el, { 'data-depth': `${quotes.length + 1}` }, el.innerText.slice(1)),
    ])),
    html('br'),
  ])));
