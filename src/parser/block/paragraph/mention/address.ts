import { ParagraphParser } from '../../../block';
import { union, line, rewrite, focus, match, convert, trim, fmap } from '../../../../combinator';
import { link } from '../../../inline';
import { contentline } from '../../../source/line';
import { memoize } from '../../../util';
import { define } from 'typed-dom';

export const address: ParagraphParser.MentionParser.AddressParser = line(fmap(match(
  /^>+(?=\S+\s*$)/,
  memoize(([prefix]) => prefix,
  prefix =>
    trim(rewrite(
      union([
        focus(/^[a-zA-Z0-9]+(?:[/-][a-zA-Z0-9]+)*$/, contentline),
        focus(/^https?:\/\/[^/\s]\S*$/, contentline),
      ]),
      convert(source => `[${prefix}]{ ${source} }`, union([link])))))),
  ([el]) => [
    define(el,
      {
        class: 'address',
        'data-level': `${el.textContent!.length}`,
        href: null
      },
      `${el.textContent}${el.getAttribute('href')}`)
  ]));
