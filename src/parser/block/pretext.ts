import { PretextParser } from '../block';
import { verifyBlockEnd } from './end';
import { loop } from '../../combinator';
import { escsource } from '../source/escapable';
import { squash } from '../squash';

const syntax = /^(`{3,})[^\n]*\n(?:[^\n]*\n)+?\1[^\S\n]*(?=\n|$)/;

export const pretext: PretextParser = verifyBlockEnd((source: string): [[HTMLPreElement], string] | undefined => {
  if (!source.startsWith('```')) return;
  const [whole, keyword] = source.match(syntax) || ['', ''];
  if (!whole) return;
  const [, lang] = source.split('\n', 1)[0].match(/^(?:`{3,})(\S*)/);
  const [ts] = loop(escsource, /^\s/)(source.split('\n', 1)[0].slice(keyword.length + lang.length).trim()) || [[]];
  const filename = squash(ts).textContent!;
  const el = document.createElement('pre');
  if (lang) {
    void el.setAttribute('class', `language-${lang.toLowerCase()}`);
    void el.setAttribute('data-lang', lang);
  }
  if (filename) {
    void el.setAttribute('data-file', filename);
  }
  void el.appendChild(document.createTextNode(whole.slice(whole.indexOf('\n') + 1, whole.lastIndexOf('\n'))));
  return [[el], source.slice(whole.length + 1)];
});
