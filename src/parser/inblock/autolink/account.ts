import { AutolinkParser } from '../../inblock';
import { union, subline, focus } from '../../../combinator';
import '../../source/unescapable';
import { html, text } from 'typed-dom';

export const account: AutolinkParser.AccountParser = subline(union([
  focus(
    /^[0-9a-zA-Z@]@+/,
    frag => [[text(frag)], '']),
  focus(
    /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/,
    source => [[html('a', { class: 'account', rel: 'noopener' }, source)], ''])
]));
