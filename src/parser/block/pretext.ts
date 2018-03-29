import { PretextParser } from '../block';
import { some, trim } from '../../combinator';
import { block } from '../source/block';
import { escsource } from '../source/escapable';
import { stringify } from '../util';
import { html } from 'typed-dom';

const syntax = /^(`{3,})([^\n]*)\n(?:([\s\S]*?)\n)?\1[^\S\n]*(?:\n|$)/;

export const pretext: PretextParser = block(source => {
  if (!source.startsWith('```')) return;
  const [whole = '', , notes = '', body = ''] = source.match(syntax) || [];
  if (!whole) return;
  const el = html('pre', body);
  const lang = notes.split(/\s/, 1)[0];
  if (lang) {
    void el.setAttribute('class', `language-${lang.toLowerCase()}`);
    void el.setAttribute('data-lang', lang);
  }
  const filepath = stringify((trim(some(escsource, /^\s/))(notes.slice(lang.length)) || [[]])[0]);
  if (filepath) {
    void el.setAttribute('data-file', filepath);
  }
  return [[el], source.slice(whole.length)];
});
