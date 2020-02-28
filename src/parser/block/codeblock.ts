import { CodeBlockParser } from '../block';
import { some, block, validate, clear, fence, fmap, eval } from '../../combinator';
import { defrag } from '../util';
import { escsource } from '../source';
import { autolink } from '../autolink';
import { html, define } from 'typed-dom';
import { join } from 'spica/array';

const opener = /^(`{3,})(?!`)(\S*)([^\n]*)\n?/;
const language = /^[a-z0-9]+(?:-[a-z][a-z0-9]*)*$/;

export const segment: CodeBlockParser.SegmentParser = block(validate('```',
  clear(fence(opener, 300, true))));

export const segment_: CodeBlockParser.SegmentParser = block(validate('```',
  clear(fence(opener, 300, false))), false);

export const codeblock: CodeBlockParser = block(validate('```', fmap(
  fence(opener, 300, true),
  // Bug: Remove the annotation.
  ([body, closer, opener, , lang, param]: string[], _, context) => {
    [lang, param] = language.test(lang)
      ? [lang, param]
      : ['', lang + param];
    param = param.trim();
    const path = join(eval(some(escsource, /^\s/)(param, context)));
    if (!closer || param !== path) return [html('pre', {
      class: 'notranslate invalid',
      'data-invalid-syntax': 'codeblock',
      'data-invalid-message': `Invalid ${closer ? 'parameter' : 'content'}`,
    }, `${opener}${body}${closer}`)];
    const file = path.split('/').pop() || '';
    const ext = file && file.includes('.') && file[0] !== '.'
      ? file.split('.').pop()!
      : '';
    lang = language.test(lang || ext)
      ? lang || ext
      : lang && 'invalid';
    const el = html('pre', { class: 'notranslate' }, body.slice(0, -1) || void 0);
    if (lang) {
      void el.classList.add('code');
      void el.classList.add(`language-${lang}`);
      void el.setAttribute('data-lang', lang);
    }
    else {
      void define(el, defrag(eval(some(autolink)(el.textContent!, context))));
    }
    if (path) {
      void el.setAttribute('data-file', path);
    }
    return [el];
  })));
