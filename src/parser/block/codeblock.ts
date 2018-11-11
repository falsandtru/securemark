import { CodeBlockParser } from '../block';
import { some, match, block, focus, rewrite, lazy, eval } from '../../combinator';
import { escsource } from '../source/escapable';
import '../source/unescapable';
import { stringify } from '../util';
import { html } from 'typed-dom';

export const segment: CodeBlockParser = block(lazy(() => segment_));

export const segment_: CodeBlockParser = block(focus(
  /^(`{3,})(?!`)(\S*)([^\n]*)\n((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$)/,
  _ => [[], '']), false);

export const codeblock: CodeBlockParser = block(rewrite(segment, match(
  /^(`{3,})(?!`)(\S*)([^\n]*)\n((?:[^\n]*\n)*?)\1\s*$/,
  ([, , lang, notes, body], rest) => {
    assert(rest === '');
    const el = html('pre', { class: 'notranslate' }, body.slice(0, -1));
    if (lang) {
      void el.classList.add('code');
      void el.classList.add(`language-${lang.toLowerCase()}`);
      void el.setAttribute('data-lang', lang);
    }
    const filepath = eval(stringify(some(escsource, /^\s/))(notes.trim())).join('');
    if (filepath) {
      void el.setAttribute('data-file', filepath);
    }
    return [[el], rest];
  })));
