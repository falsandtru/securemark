import { AutolinkParser } from '../../inline';

const syntax = /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/;
const escape = /^[0-9a-zA-Z@]@.*?(?!@)/;

export const account: AutolinkParser.AccountParser = (source: string) => {
  const [flag = undefined] = source.match(escape) || [];
  if (flag) return [[document.createTextNode(flag)], source.slice(flag.length)];
  const [whole = ''] = source.match(syntax) || [];
  if (!whole) return;
  const el = document.createElement('span');
  void el.setAttribute('class', 'account');
  void el.appendChild(document.createTextNode(whole));
  return [[el], source.slice(whole.length)];
};
