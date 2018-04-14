import { AutolinkParser } from '../../inline';
import { union, match } from '../../../combinator';
import { line } from '../../source/line';
import { html, text } from 'typed-dom';

const syntax = /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/;

export const account: AutolinkParser.AccountParser = union([
  match(/^[0-9a-zA-Z@]@.*?(?!@)/, ([frag], rest) =>
    [[text(frag)], rest]),
  line(match(syntax, ([whole], rest) =>
    [[html('a', { class: 'account', rel: 'noopener' }, whole)], rest]
  ), false)
]);
