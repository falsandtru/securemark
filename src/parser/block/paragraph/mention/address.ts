import { ParagraphParser } from '../../../block';
import { union, sequence, line, focus, creator, fmap, convert } from '../../../../combinator';
import { link, url2link } from '../../../inline';
import { str } from '../../../source';
import { define } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = creator(line(fmap(
  sequence([
    str(/^>+(?!>)(?=\S+\s*$)/),
    union([
      focus(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?=\s*$)/, convert(source => `[${source}]{ ?log=${source} }`, link)),
      focus(/^h?ttps?:\/\/[^/?#\s]\S*(?=\s*$)/, convert(url2link, link)),
    ]),
  ]),
  ([sym, link]: [string, HTMLAnchorElement]) => [
    define(link,
      {
        class: 'address',
        'data-level': `${sym.length}`,
      },
      `${sym}${link.textContent}`)
  ])));
