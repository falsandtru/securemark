import { ParagraphParser } from '../../../block';
import { tails, some, line, validate, fmap } from '../../../../combinator';
import { address as addr } from '../../../inline';
import { str } from '../../../source/str';
import { html } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = validate(
  /^(>+)[0-9][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*[^\S\n]*(?:$|\n(?:\1[0-9][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*[^\S\n]*(?:$|\n))*(?!\1))/,
  some(line(fmap(
    tails([
      str(/^>*(?=>)/),
      addr,
    ]),
    ns => [html('span', { class: 'quotation' }, ns)]))));
