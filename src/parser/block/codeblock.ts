import { CodeBlockParser } from '../block';
import { some, block, rewrite, focus, match, trim, lazy, eval } from '../../combinator';
import { escsource } from '../source';
import { defrag, stringify } from '../util';
import { html, define } from 'typed-dom';
import { autolink } from '../autolink';

const language = /^[a-z0-9]+(?:-[a-z][a-z0-9]*)*$/

export const segment: CodeBlockParser.SegmentParser = lazy(() => block(segment_));

export const segment_: CodeBlockParser.SegmentParser = block(focus(
  /^(`{3,})(?!`)(\S*)([^\n]*)\n((?:[^\n]*\n){0,300}?)\1[^\S\n]*(?:\n|$)/,
  () => [[], '']), false);

export const codeblock: CodeBlockParser = block(rewrite(segment, trim(match(
  /^(`{3,})(?!`)(\S*)([^\n]*)\n([\s\S]*)\1$/,
  ([, , lang, param, body]) => (rest, state, config) => {
    assert(rest === '');
    [lang, param] = language.test(lang)
      ? [lang, param]
      : ['', lang + param];
    param = param.trim();
    const path = stringify(eval(some(escsource, /^\s/)(param, state, config)));
    const file = path.split('/').pop() || '';
    const ext = file && file.includes('.') && !file.startsWith('.')
      ? file.split('.').pop()!
      : '';
    lang = language.test(lang || ext)
      ? lang || ext
      : lang && 'invalid';
    const el = html('pre', { class: 'notranslate' }, body.slice(0, -1));
    if (lang) {
      void el.classList.add('code');
      void el.classList.add(`language-${lang}`);
      void el.setAttribute('data-lang', lang);
    }
    else {
      void define(el, eval(defrag(some(autolink))(el.textContent!, state, config)));
    }
    if (path) {
      void el.setAttribute('data-file', path);
    }
    if (param !== path) {
      void el.classList.add('invalid');
      void define(el, {
        'data-invalid-syntax': 'codeblock',
        'data-invalid-type': 'parameter',
      });
    }
    return [[el], rest];
  }))));
