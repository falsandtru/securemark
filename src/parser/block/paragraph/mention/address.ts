import { ParagraphParser } from '../../../block';
import { union, sequence, some, line, validate, focus, convert, configure, fmap } from '../../../../combinator';
import { link, address as addr, attribute as attr } from '../../../inline';
import { char } from '../../../source/char';
import { defrag } from '../../../util';
import { define } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = line(fmap(validate(
  /^>+(?!>)\S+\s*$/,
  configure({ syntax: { inline: { link: void 0 } } },
  sequence([
    defrag(some(char('>'))),
    union([
      focus(/^[A-Za-z0-9]+(?:[/-][A-Za-z0-9]+)*(?=\s*$)/, convert(source => `[]{ ${source} }`, link)),
      focus(/^h?ttps?:\/\/[^/?#\s]\S*(?=\s*$)/, convert(source => `[]{ ${addr(source)}${attr(source)} }`, link)),
    ]),
  ]))),
  ([{ data: flag }, link]: [Text, HTMLAnchorElement]) => [
    define(link,
      {
        class: 'address',
        'data-level': `${flag.length}`,
        href: null
      },
      `${flag}${link.textContent}`)
  ]));
