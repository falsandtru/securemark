import { undefined } from 'spica/global';
import { CodeBlockParser } from '../block';
import { eval } from '../../combinator/data/parser';
import { some, block, validate, fence, clear, fmap } from '../../combinator';
import { autolink } from '../autolink';
import { escsource } from '../source';
import { html, defrag } from 'typed-dom';
import { join } from 'spica/array';

const opener = /^(`{3,})(?!`)(\S*)([^\n]*)(?:$|\n)/;
const language = /^[0-9a-z]+(?:-[a-z][0-9a-z]*)*$/;

export const segment: CodeBlockParser.SegmentParser = block(validate('```',
  clear(fence(opener, 300))));

export const segment_: CodeBlockParser.SegmentParser = block(validate('```',
  clear(fence(opener, 300, false))), false);

export const codeblock: CodeBlockParser = block(validate('```', fmap(
  fence(opener, 300),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim, lang, param]: string[], _, context) => {
    [lang, param] = language.test(lang)
      ? [lang, param]
      : ['', lang + param];
    param = param.trim();
    const path = join(eval(some(escsource, /^\s/)(param, context), []));
    if (!closer || param !== path) return [html('pre', {
      class: 'invalid',
      translate: 'no',
      'data-invalid-syntax': 'codeblock',
      'data-invalid-type': !closer ? 'closer' : 'argument',
      'data-invalid-message': !closer ? `Missing the closing delimiter "${delim}"` : 'Invalid argument',
    }, `${opener}${body}${closer}`)];
    const file = path.split('/').pop() ?? '';
    const ext = file && file.includes('.', 1)
      ? file.split('.').pop()!
      : '';
    lang = language.test(lang || ext)
      ? lang || ext
      : lang && 'invalid';
    const el = html('pre',
      {
        class: lang ? `code language-${lang}` : 'text',
        translate: 'no',
        'data-lang': lang || undefined,
        'data-path': path || undefined,
      },
      lang
        ? context.caches?.code?.get(`${lang}\n${body.slice(0, -1)}`)?.cloneNode(true).childNodes ||
          body.slice(0, -1) || undefined
        : defrag(eval(some(autolink)(body.slice(0, -1), context), [])));
    return [el];
  })));
