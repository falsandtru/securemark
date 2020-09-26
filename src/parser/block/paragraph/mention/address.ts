import { ParagraphParser } from '../../../block';
import { tails, line, creator, fmap } from '../../../../combinator';
import { address as addr } from '../../../inline';
import { str } from '../../../source/str';
import { html } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = creator(line(fmap(
  tails([
    str(/^>*(?=>)/),
    addr,
  ]),
  ns => [html('span', { class: 'quotation' }, ns)])));
