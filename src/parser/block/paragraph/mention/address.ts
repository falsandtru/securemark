import { ParagraphParser } from '../../../block';
import { union, sequence, some, line, validate, focus, convert, configure, fmap } from '../../../../combinator';
import { link, address as addr, attribute as attr } from '../../../inline';
import { char } from '../../../source/char';
import { defrag } from '../../../util';
import { define } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = line(fmap(validate(
  /^>+(?!>)\S+\s*$/,
  configure({ syntax: { inline: { link: undefined } } },
  sequence([
    defrag(some(char('>'))),
    union([
      focus(/^[a-zA-Z0-9]+(?:[/-][a-zA-Z0-9]+)*(?=\s*$)/, convert(source => `[]{ ${source} }`, link)),
      focus(/^h?ttps?:\/\/[^/?#\s]\S*(?=\s*$)/, convert(source => `[]{ ${addr(source)}${attr(source)} }`, link)),
    ]),
  ]))),
  ([flag, link]: [Text, HTMLAnchorElement]) => [
    define(link,
      {
        class: 'address',
        'data-level': `${flag.textContent!.length}`,
        href: null
      },
      `${flag.textContent}${link.textContent}`)
  ]));
