import { ParagraphParser } from '../../../block';
import { union, line, match, convert, fmap } from '../../../../combinator';
import { link } from '../../../inline/link';
import { define } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = line(match(
  /^(?=((>+)[a-zA-Z0-9](?:(?!\s)[\x00-\x7F])*\s*$))/,
  ([, addr, { length: level }]) =>
    convert(
      source => `{ ${addr.slice(level).trim()} }${source.slice(addr.length)}`,
      fmap(union([link]), ([el]) =>
        [define(el, { class: 'address', href: null, 'data-level': `${level}` }, addr.trim())]))));
