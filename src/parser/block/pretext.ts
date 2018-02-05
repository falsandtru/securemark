import { PretextParser } from '../block';
import { verify } from './util/verification';
import { loop } from '../../combinator';
import { escsource } from '../source/escapable';
import { squash } from '../squash';

const syntax = /^(`{3,})([^\n]*)\n(?:([\s\S]*?)\n)?\1[^\S\n]*(?:\n|$)/;

export const pretext: PretextParser = verify(source => {
  if (!source.startsWith('```')) return;
  const [whole = '', , notes = '', body = ''] = source.match(syntax) || [];
  if (!whole) return;
  const el = document.createElement('pre');
  const lang = notes.split(/\s/, 1)[0];
  if (lang) {
    void el.setAttribute('class', `language-${lang.toLowerCase()}`);
    void el.setAttribute('data-lang', lang);
  }
  const filepath = squash((loop(escsource, /^\s/)(notes.slice(lang.length).trim()) || [[]])[0]).textContent!;
  if (filepath) {
    void el.setAttribute('data-file', filepath);
  }
  void el.appendChild(document.createTextNode(body));
  return [[el], source.slice(whole.length)];
});
