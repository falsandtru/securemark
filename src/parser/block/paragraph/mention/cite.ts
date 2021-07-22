import { ParagraphParser } from '../../../block';
import { tails, line, validate, creator, reverse, fmap } from '../../../../combinator';
import { anchor } from '../../../inline/autolink/anchor';
import { str } from '../../../source';
import { html, define, defrag } from 'typed-dom';

export const cite: ParagraphParser.MentionParser.CiteParser = creator(line(fmap(validate(
  '>',
  reverse(tails([
    str(/^>*(?=>)/),
    anchor,
  ]))),
  ([el, str = '']: [HTMLElement, string?]) => [html('span', { class: 'cite' }, defrag([str, define(el, { 'data-depth': `${str.length + 1}` })]))])));
