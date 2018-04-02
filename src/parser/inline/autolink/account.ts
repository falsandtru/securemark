import { AutolinkParser } from '../../inline';
import { union, match } from '../../../combinator';
import { line } from '../../source/line';
import { html } from 'typed-dom';

const syntax = /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/;

export const account: AutolinkParser.AccountParser = union([
  match(/^[0-9a-zA-Z@]@.*?(?!@)/, ([frag], source) =>
    [[document.createTextNode(frag)], source.slice(frag.length)]),
  line(match(syntax, ([whole], source) =>
    [[html('a', { class: 'account', rel: 'noopener' }, whole)], source.slice(whole.length)]
  ), false)
]);
