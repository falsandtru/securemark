import { ParagraphParser } from '../../../block';
import { union, line, match, convert, fmap } from '../../../../combinator';
import { link } from '../../../inline';
import { html, define } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = line(match(
  /^(?=((>+)(?:[a-zA-Z0-9]+(?:[/-][a-zA-Z0-9]+)*|https?:\/\/[^/]\S*)\s*$))/,
  ([, addr, { length: level }]) =>
    convert(
      source => `{ ${addr.slice(level).trim()} }${source.slice(addr.length)}`,
      fmap(union([link]), ([el]) => [
        html('span',
          { class: 'address', href: null, 'data-level': `${level}` },
          [define(el, { href: null }, addr.trim())])
      ]))));
