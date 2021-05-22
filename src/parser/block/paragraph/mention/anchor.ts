import { ParagraphParser } from '../../../block';
import { tails, line, validate, creator, fmap } from '../../../../combinator';
import { anchor as anch } from '../../../inline/autolink/anchor';
import { str } from '../../../source';
import { html, define } from 'typed-dom';

export const anchor: ParagraphParser.MentionParser.AnchorParser = creator(line(fmap(validate(
  '>',
  tails([
    str(/^>*(?=>)/),
    fmap(anch, ([el]) => [define(el, { class: void el.classList.add('quote-anchor') })]),
  ])),
  ns => [html('span', { class: 'quote' }, ns)])));
