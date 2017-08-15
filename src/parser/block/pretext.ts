import { Result } from '../../combinator/parser';
import { PreTextParser } from '../block';
import { verifyBlockEnd } from './end';
import { UnescapableSourceParser } from '../source';

type SubParsers = [UnescapableSourceParser];

const syntax = /^(`{3,})([a-z]*)(?:[^\S\n]+([0-9a-zA-Z_\-.]+))?[^\S\n]*\n(?:[^\n]*\n)+?\1[^\S\n]*(?=\n|$)/;

export const pretext: PreTextParser = verifyBlockEnd(function (source: string): Result<HTMLPreElement, SubParsers> {
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
  return [[el], source.slice(whole.length + 1)];
});
