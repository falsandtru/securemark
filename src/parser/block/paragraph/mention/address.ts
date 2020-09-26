import { ParagraphParser } from '../../../block';
import { tails, some, line, fmap } from '../../../../combinator';
import { address as addr } from '../../../inline';
import { str } from '../../../source/str';
import { html } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = some(line(fmap(
  tails([
    str(/^>*(?=>)/),
    addr,
  ]),
  ns => [html('span', { class: 'quotation' }, ns)])));
