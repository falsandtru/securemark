import { undefined } from 'spica/global';
import { CodeBlockParser } from '../block';
import { eval } from '../../combinator/data/parser';
import { some, block, validate, fence, clear, fmap } from '../../combinator';
import { autolink } from '../autolink';
import { html, defrag } from 'typed-dom/dom';

const opener = /^(`{3,})(?!`)([^\n]*)(?:$|\n)/;
const language = /^[0-9a-z]+(?:-[a-z][0-9a-z]*)*$/i;

export const segment: CodeBlockParser.SegmentParser = block(validate('```',
  clear(fence(opener, 300))));

export const segment_: CodeBlockParser.SegmentParser = block(validate('```',
  clear(fence(opener, 300, false))), false);

export const codeblock: CodeBlockParser = block(validate('```', fmap(
  fence(opener, 300),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim, param]: string[], _, context) => {
    const params = param.match(/(?:\\.?|\S)+/g)?.reduce<{
      lang?: string;
      path?: string;
      line?: string;
      invalid?: string;
    }>((params, value, i) => {
      let name: string;
      switch (true) {
        case i === 0
          && value[0] === param[0]
          && language.test(value):
          name = 'lang';
          value = value.toLowerCase();
          break;
        case /^\d+(?:[,-]\d+)*$/.test(value):
          name = 'line';
          break;
        default:
          name = 'path';
          if (!params.lang) {
            const file = value.split('/').pop() ?? '';
            params.lang = file && file.includes('.', 1)
              ? file.split('.').pop()?.match(language)?.[0].toLowerCase()
              : params.lang;
          }
      }
      name in params
        ? params.invalid = `Duplicate ${name} value`
        : params[name] = value;
      return params;
    }, {}) ?? {};
    if (!closer || params.invalid) return [html('pre', {
      class: 'invalid',
      translate: 'no',
      'data-invalid-syntax': 'codeblock',
      'data-invalid-type': !closer ? 'fence' : 'argument',
      'data-invalid-message': !closer ? `Missing the closing delimiter "${delim}"` : params.invalid,
    }, `${opener}${body}${closer}`)];
    const el = html('pre',
      {
        class: params.lang ? `code language-${params.lang}` : 'text',
        translate: 'no',
        'data-lang': params.lang || undefined,
        'data-line': params.line || undefined,
        'data-path': params.path || undefined,
      },
      params.lang
        ? context.caches?.code?.get(`${params.lang ?? ''}\n${body.slice(0, -1)}`)?.cloneNode(true).childNodes ||
          body.slice(0, -1) || undefined
        : defrag(eval(some(autolink)(body.slice(0, -1), context), [])));
    return [el];
  })));
