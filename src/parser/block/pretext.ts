import { Result } from '../../combinator/parser';
import { PreTextParser, verifyBlockEnd } from '../block';
import { PlainTextParser } from '../text';

type SubParsers = [PlainTextParser];

const syntax = /^(`{3,})([a-z]*)(?:[^\S\n]+([0-9a-zA-Z_\-.]+))?[^\S\n]*\n(?:[^\n]*\n)+?\1[^\S\n]*(?=\n|$)/;

export const pretext: PreTextParser = function (source: string): Result<HTMLPreElement, SubParsers> {
  if (!source.startsWith('```')) return;
  const [whole, , lang, filename = ''] = source.match(syntax) || ['', '', ''];
  if (!whole) return;
  const el = document.createElement('pre');
  if (lang) {
    void el.setAttribute('class', `language-${lang.toLowerCase()}`);
    void el.setAttribute('data-lang', `${lang.toLowerCase()}`);
  }
  if (filename) {
    void el.setAttribute('data-file', filename);
  }
  void el.appendChild(document.createTextNode(whole.slice(whole.indexOf('\n') + 1, whole.lastIndexOf('\n'))));
  return verifyBlockEnd<HTMLPreElement, SubParsers>([el], source.slice(whole.length + 1));
};
