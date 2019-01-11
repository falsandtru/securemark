import { CodeBlockParser } from '../block';
import { some, block, rewrite, focus, match, trim, lazy, eval } from '../../combinator';
import { escsource } from '../source/escapable';
import '../source/unescapable';
import { stringify } from '../util';
import { html, define } from 'typed-dom';
import { autolink } from '../autolink';

export const segment: CodeBlockParser = lazy(() => block(segment_));

export const segment_: CodeBlockParser = block(focus(
  /^(`{3,})(?!`)(\S*)([^\n]*)\n((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$)/,
  _ => [[], '']), false);

export const codeblock: CodeBlockParser = block(rewrite(segment, trim(match(
  /^(`{3,})(?!`)(\S*)([^\n]*)\n((?:[^\n]*\n)*?)\1$/,
  ([, , lang, param, body]) => rest => {
    assert(rest === '');
    const el = html('pre', { class: 'notranslate' }, body.slice(0, -1));
    if (lang) {
      void el.classList.add('code');
      void el.classList.add(`language-${lang.toLowerCase()}`);
      void el.setAttribute('data-lang', lang);
    }
    else {
      void define(el, eval(some(autolink)(el.textContent!)));
    }
    const filepath = stringify(eval(some(escsource, /^\s/)(param.trim())));
    if (filepath) {
      void el.setAttribute('data-file', filepath);
    }
    return [[el], rest];
  }))));
