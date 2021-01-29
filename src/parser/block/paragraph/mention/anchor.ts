import { ParagraphParser } from '../../../block';
import { tails, line, validate, creator, fmap } from '../../../../combinator';
import { anchor as anch } from '../../../inline';
import { str } from '../../../source';
import { html } from 'typed-dom';

export const anchor: ParagraphParser.MentionParser.AnchorParser = creator(line(fmap(validate(
  '>',
  tails([
    str(/^>*(?=>)/),
    anch,
  ])),
  ns => [html('span', { class: 'quote' }, ns)])));
