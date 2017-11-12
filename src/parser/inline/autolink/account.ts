import { Result } from '../../../combinator';
import { AutolinkParser } from '../../inline';

const syntax = /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*(?!@)/;
const escape = /^[0-9a-zA-Z@]@/;

export const account: AutolinkParser.AccountParser = function (source: string): Result<HTMLSpanElement | Text, [never]> {
  if (source.search(escape) === 0) {
    const [frag] = source.match(/^[0-9a-zA-Z@].*?(?!@|h?ttps?:)/) || [source];
    return [[document.createTextNode(frag)], source.slice(frag.length)];
  }
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  const el = document.createElement('span');
  void el.setAttribute('class', 'account');
  void el.appendChild(document.createTextNode(whole));
  return [[el], source.slice(whole.length)];
};
