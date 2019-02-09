import { ParagraphParser } from '../../../block';
import { line, match } from '../../../../combinator';
import '../../../source/unescapable';
import { html } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = line(
  match(
    /^(>+)[a-zA-Z0-9](?:(?!\s)[\x00-\x7F])*\s*$/,
    ([ref, { length: level }]) => rest =>
      [[html('a', { class: 'address', rel: 'noopener', 'data-level': `${level}` }, ref.trim())], rest]));
