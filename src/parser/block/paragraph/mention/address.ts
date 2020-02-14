import { ParagraphParser } from '../../../block';
import { union, sequence, line, focus, creation, backtrack, convert, fmap } from '../../../../combinator';
import { link, address as addr, attribute as attr } from '../../../inline';
import { str } from '../../../source';
import { define } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = line(creation(fmap(
  sequence([
    str(/^>+(?!>)(?=\S+\s*$)/),
    union([
      focus(/^[A-Za-z0-9]+(?:[/-][A-Za-z0-9]+)*(?=\s*$)/, backtrack(convert(source => `{ ${source} }`, link))),
      focus(/^h?ttps?:\/\/[^/?#\s]\S*(?=\s*$)/, backtrack(convert(source => `{ ${addr(source)}${attr(source)} }`, link))),
    ]),
  ]),
  ([{ data: flag }, link]: [Text, HTMLAnchorElement]) => [
    define(link,
      {
        class: 'address',
        'data-level': `${flag.length}`,
        href: null,
      },
      `${flag}${link.textContent}`)
  ])));
