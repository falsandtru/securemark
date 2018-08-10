import { PretextParser } from '../block';
import { some, match, block, focus, build, eval } from '../../combinator';
import { escsource } from '../source/escapable';
import '../source/unescapable';
import { stringify } from '../util';
import { html } from 'typed-dom';

export const segment: PretextParser = block(build(() => segment_));

export const segment_: PretextParser = block(match(
  /^(`{3,})(\S*)([^\n]*)\n((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$)/,
  (_, rest) => [[], rest]), false);

export const pretext: PretextParser = block(focus(segment, match(
  /^(`{3,})(\S*)([^\n]*)\n((?:[^\n]*\n)*?)\1\s*$/,
  ([, , lang, notes, body], rest) => {
    assert(rest === '');
    const el = html('pre', { class: 'notranslate' }, body.slice(0, -1));
    if (lang) {
      void el.classList.add(`language-${lang.toLowerCase()}`);
      void el.setAttribute('data-lang', lang);
    }
    const filepath = stringify(eval(some(escsource, /^\s/)(notes.trim())));
    if (filepath) {
      void el.setAttribute('data-file', filepath);
    }
    return [[el], rest];
  })));
