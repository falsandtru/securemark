import { ParagraphParser } from '../../../block';
import { union, sequence, line, focus, creator, convert, fmap } from '../../../../combinator';
import { link, address as addr, attribute as attr } from '../../../inline';
import { str } from '../../../source';
import { define } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = line(creator(fmap(
  sequence([
    str(/^>+(?!>)(?=\S+\s*$)/),
    union([
      focus(/^[A-Za-z0-9]+(?:[/-][A-Za-z0-9]+)*(?=\s*$)/, convert(source => `{ ${source} }`, link)),
      focus(/^h?ttps?:\/\/[^/?#\s]\S*(?=\s*$)/, convert(source => `{ ${addr(source)}${attr(source)} }`, link)),
    ]),
  ]),
  ([sym, link]: [string, HTMLAnchorElement]) => [
    define(link,
      {
        class: 'address',
        'data-level': `${sym.length}`,
        href: null,
      },
      `${sym}${link.textContent}`)
  ])));
