import { AutolinkParser } from '../../inline';
import { union, match, subline } from '../../../combinator';
import '../../source/unescapable';
import { html, text } from 'typed-dom';

export const account: AutolinkParser.AccountParser = subline(union([
  match(
    /^[0-9a-zA-Z@]@+/,
    ([frag], rest) =>
      [[text(frag)], rest]),
  match(
    /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*/,
    ([whole], rest) =>
      [[html('a', { class: 'account', rel: 'noopener' }, whole)], rest])
]));
