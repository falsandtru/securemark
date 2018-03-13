﻿import { PretextParser } from '../block';
import { some } from '../../combinator';
import { block } from '../source/block';
import { escsource } from '../source/escapable';
import { text } from '../util';
import { html } from 'typed-dom';

const syntax = /^(`{3,})([^\n]*)\n(?:([\s\S]*?)\n)?\1[^\S\n]*(?:\n|$)/;

export const pretext: PretextParser = block(source => {
  if (!source.startsWith('```')) return;
  const [whole = '', , notes = '', body = ''] = source.match(syntax) || [];
  if (!whole) return;
  const el = html('pre');
  const lang = notes.split(/\s/, 1)[0];
  if (lang) {
    void el.setAttribute('class', `language-${lang.toLowerCase()}`);
    void el.setAttribute('data-lang', lang);
  }
  const filepath = text((some(escsource, /^\s/)(notes.slice(lang.length).trim()) || [[] as Text[]])[0]);
  if (filepath) {
    void el.setAttribute('data-file', filepath);
  }
  void el.appendChild(document.createTextNode(body));
  return [[el], source.slice(whole.length)];
});
