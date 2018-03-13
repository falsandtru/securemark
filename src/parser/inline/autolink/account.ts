import { AutolinkParser } from '../../inline';
import { line } from '../../source/line';
import { html } from 'typed-dom';

const syntax = /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/;
const escape = /^[0-9a-zA-Z@]@.*?(?!@)/;

export const account: AutolinkParser.AccountParser = line(source => {
  const [flag = undefined] = source.match(escape) || [];
  if (flag) return [[document.createTextNode(flag)], source.slice(flag.length)];
  const [whole = ''] = source.match(syntax) || [];
  if (!whole) return;
  return [[html('a', { class: 'account', rel: 'noopener' }, whole)], source.slice(whole.length)];
}, false);
