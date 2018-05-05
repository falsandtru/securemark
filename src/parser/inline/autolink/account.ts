import { AutolinkParser } from '../../inline';
import { union, capture } from '../../../combinator';
import { line } from '../../source/line';
import { html, text } from 'typed-dom';

export const account: AutolinkParser.AccountParser = line(union([
  capture(
    /^[0-9a-zA-Z@]@.*?(?!@)/,
    ([frag], rest) =>
      [[text(frag)], rest]),
  capture(
    /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/,
    ([whole], rest) =>
      [[html('a', { class: 'account', rel: 'noopener' }, whole)], rest])
]), false);
