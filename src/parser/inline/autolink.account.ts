import { Result } from '../../parser';
import { AutolinkParser } from '../inline';

type SubParsers = [never];

const syntax = /^@[a-zA-Z0-9]+(?:[_\-]+[0-9a-zA-Z]+)*(?![0-9a-zA-Z@])/;
const escape = /^[0-9a-zA-Z@]@/;

export const account: AutolinkParser.AccountParser = function (source: string): Result<HTMLSpanElement | Text, SubParsers> {
  if (source.search(escape) === 0) {
    const [txt] = source.match(/^[0-9a-zA-Z@].*?(?!@|h?ttps?:)/) || [source];
    return [[document.createTextNode(txt)], source.slice(txt.length)];
  }
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  const el = document.createElement('span');
  void el.setAttribute('class', 'account');
  void el.appendChild(document.createTextNode(whole));
  return [[el], source.slice(whole.length)];
};
