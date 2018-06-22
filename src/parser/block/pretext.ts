import { PretextParser } from '../block';
import { some, match, rewrite, trimEnd, build } from '../../combinator';
import { block } from '../source/block';
import { escsource } from '../source/escapable';
import '../source/unescapable';
import { stringify } from '../util';
import { html } from 'typed-dom';

export const segment: PretextParser = block(build(() => segment_));

export const segment_: PretextParser = block(match(
  /^(`{3,})(\S*)([^\n]*)\n((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$)/,
  (_, rest) => [[], rest]), false);

export const pretext: PretextParser = block(rewrite(segment, trimEnd(match(
  /^(`{3,})(\S*)([^\n]*)\n((?:[^\n]*\n)*?)\1$/,
  ([, , lang, notes, body], rest) => {
    assert(rest === '');
    const el = html('pre', { class: 'notranslate' }, body.slice(0, -1));
    if (lang) {
      void el.classList.add(`language-${lang.toLowerCase()}`);
      void el.setAttribute('data-lang', lang);
    }
    const filepath = stringify((some(escsource, /^\s/)(notes.trim()) || [[]])[0]);
    if (filepath) {
      void el.setAttribute('data-file', filepath);
    }
    return [[el], rest];
  }))));
