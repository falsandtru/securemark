import { AutolinkParser } from '../../inblock';
import { union, match, subline, focus } from '../../../combinator';
import '../../source/unescapable';
import { html, text } from 'typed-dom';

export const account: AutolinkParser.AccountParser = subline(union([
  match(
    /^[0-9a-zA-Z@]@+/,
    ([frag], rest) =>
      [[text(frag)], rest]),
  focus(
    match(/^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/, (_, rest) => [[], rest]),
    source => [[html('a', { class: 'account', rel: 'noopener' }, source)], ''])
]));
