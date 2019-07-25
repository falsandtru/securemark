import { ParagraphParser } from '../../../block';
import { union, some, line, rewrite, focus, match, convert, trim, fmap } from '../../../../combinator';
import { link } from '../../../inline';
import { unescsource } from '../../../source/unescapable';
import { html, define } from 'typed-dom';
import { memoize } from '../../../util';

export const address: ParagraphParser.MentionParser.AddressParser = line(
  fmap(
    match(
      /^>+(?=\S+\s*$)/,
      memoize(([prefix]) => prefix,
      prefix =>
        trim(rewrite(
          union([
            focus(/^[a-zA-Z0-9]+(?:[/-][a-zA-Z0-9]+)*$/, some(unescsource)),
            focus(/^https?:\/\/[^/\s]\S*$/, some(unescsource)),
          ]),
          convert(source => `[${prefix}]{ ${source} }`, union([link])))))),
    ([el]) => [
      html('span', { class: 'address', 'data-level': `${el.textContent!.length}` }, [
        define(el, { href: null }, `${el.textContent}${el.getAttribute('href')}`)
      ])
    ]));
