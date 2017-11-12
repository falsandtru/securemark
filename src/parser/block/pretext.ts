import { Result } from '../../combinator';
import { PreTextParser } from '../block';
import { verifyBlockEnd } from './end';
import { UnescapableSourceParser } from '../source';

type SubParsers = [UnescapableSourceParser];

const syntax = /^(`{3,})[^\n]*\n(?:[^\n]*\n)+?\1[^\S\n]*(?=\n|$)/;

export const pretext: PreTextParser = verifyBlockEnd(function (source: string): Result<HTMLPreElement, SubParsers> {
  if (!source.startsWith('```')) return;
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  const [, lang, filename = ''] = source.split('\n', 1)[0].match(/^(?:`{3,})([a-z]*)(?:\s+([0-9a-zA-Z_\-.]+))?(?=\s|$)/);
  const el = document.createElement('pre');
  if (lang) {
    void el.setAttribute('class', `language-${lang.toLowerCase()}`);
    void el.setAttribute('data-lang', lang.toLowerCase());
  }
  if (filename) {
    void el.setAttribute('data-file', filename);
  }
  void el.appendChild(document.createTextNode(whole.slice(whole.indexOf('\n') + 1, whole.lastIndexOf('\n'))));
  return [[el], source.slice(whole.length + 1)];
});
