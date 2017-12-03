import { PretextParser } from '../block';
import { verify } from './util/verification';
import { loop } from '../../combinator';
import { escsource } from '../source/escapable';
import { squash } from '../squash';

const syntax = /^(`{3,})([^\n]*)\n(?:[^\n]*\n)+?\1[^\S\n]*(?=\n|$)/;

export const pretext: PretextParser = verify((source: string): [[HTMLPreElement], string] | undefined => {
  if (!source.startsWith('```')) return;
  const [whole, , notes] = source.match(syntax) || ['', '', ''];
  if (!whole) return;
  const el = document.createElement('pre');
  const lang = notes.split(/\s/, 1)[0];
  if (lang) {
    void el.setAttribute('class', `language-${lang.toLowerCase()}`);
    void el.setAttribute('data-lang', lang);
  }
  const filename = squash((loop(escsource, /^\s/)(notes.slice(lang.length).trim()) || [[]])[0]).textContent!;
  if (filename) {
    void el.setAttribute('data-file', filename);
  }
  void el.appendChild(document.createTextNode(whole.slice(whole.indexOf('\n') + 1, whole.lastIndexOf('\n'))));
  return [[el], source.slice(whole.length + 1)];
});
