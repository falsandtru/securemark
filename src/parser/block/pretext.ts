import { PretextParser } from '../block';
import { some, capture, rewrite, trim } from '../../combinator';
import { block } from '../source/block';
import { escsource } from '../source/escapable';
import { stringify } from '../util';
import { html } from 'typed-dom';

export const segment: PretextParser = block(capture(
  /^(`{3,})([^\n]*)\n(?:([\s\S]*?)\n)?\1[^\S\n]*(?:\n|$)/,
  (_, rest) => [[], rest]));

export const pretext: PretextParser = block(rewrite(
  segment,
  capture(
    /^(`{3,})([^\n]*)\n(?:([\s\S]*?)\n)?\1[^\S\n]*\n?$/,
    ([, , notes, body = ''], rest) => {
      assert(rest === '');
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
      return [[el], rest];
    })));
