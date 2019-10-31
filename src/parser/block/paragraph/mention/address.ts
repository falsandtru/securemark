import { ParagraphParser } from '../../../block';
import { union, line, focus, match, convert, trimEnd, override, fmap } from '../../../../combinator';
import { link, address as addr, attribute as attr } from '../../../inline';
import { memoize } from '../../../util';
import { define } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = line(fmap(match(
  /^>+(?!>)(?=\S+\s*$)/,
  memoize(([prefix]) => prefix,
  prefix =>
    override({ syntax: { inline: { link: undefined } } },
    trimEnd(union([
      focus(/^[a-zA-Z0-9]+(?:[/-][a-zA-Z0-9]+)*$/, convert(source => `[${prefix}]{ ${source} }`, link)),
      focus(/^h?ttps?:\/\/[^/\s]\S*$/, convert(source => `[${prefix}]{ ${addr(source)}${attr(source)} }`, link)),
    ]))))),
  ([el]) => [
    define(el,
      {
        class: 'address',
        'data-level': `${el.textContent!.length}`,
        href: null
      },
      `${el.textContent}${el.getAttribute('href')}`)
  ]));
