import { AutolinkParser } from '../../inline';
import { union, match } from '../../../combinator';
import { line } from '../../source/line';
import '../../source/unescapable';
import { html, text } from 'typed-dom';

export const account: AutolinkParser.AccountParser = line(union([
  match(
    /^[0-9a-zA-Z@]@.*?(?!@)/,
    ([frag], rest) =>
      [[text(frag)], rest]),
  match(
    /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/,
    ([whole], rest) =>
      [[html('a', { class: 'account', rel: 'noopener' }, whole)], rest])
]), false);
