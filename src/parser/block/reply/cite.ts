import { ReplyParser } from '../../block';
import { tails, line, validate, creator, reverse, fmap } from '../../../combinator';
import { anchor } from '../../inline/autolink/anchor';
import { str } from '../../source';
import { html, define, defrag } from 'typed-dom';

export const cite: ReplyParser.CiteParser = creator(line(fmap(validate(
  '>>',
  reverse(tails([
    str(/^>*(?=>>)/),
    anchor,
  ]))),
  ([el, quotes = '']: [HTMLElement, string?]) => [
    html('span', { class: 'cite' }, defrag([
      quotes + '>',
      define(el, { 'data-depth': `${quotes.length + 1}` }, el.innerText.slice(1)),
    ])),
    html('br'),
  ])));
