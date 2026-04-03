import { CodeBlockParser } from '../block';
import { Node } from '../../combinator/parser';
import { inits, force, block, fence } from '../../combinator';
import { autolink } from '../autolink';
import { unwrap, invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

const opener = /(`{3,})(?!`)([^\r\n]*)(?:$|\r?\n)/y;
const language = /^[0-9a-z]+(?:-[a-z][0-9a-z]*)*$/i;

export const segment: CodeBlockParser.SegmentParser = block(
  fence(opener, false, 300));

export const segment_: CodeBlockParser.SegmentParser = block(
  fence(opener, false, 300, false), false);

export const codeblock: CodeBlockParser = block(inits([
  fence(opener, true, 300),
  (input, output) => {
    const [body, overflow, closer, opener, delim, param] = unwrap(output.pop()) as string[];
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
        ? params.invalid = `Duplicate ${name} attribute`
        : params[name] = value;
      return params;
    }, {}) ?? {};
    if (!closer || overflow || params.invalid) {
      output.append(
        new Node(html('pre',
          {
            class: 'invalid',
            translate: 'no',
            ...invalid(
              'codeblock',
              !closer || overflow ? 'fence' : 'argument',
              !closer
                ? `Missing the closing delimiter "${delim}"`
                : overflow
                  ? `Invalid trailing line after the closing delimiter "${delim}"`
                  : params.invalid!),
          },
          `${opener}${body}${overflow || closer}`)));
      return;
    }
    const src = body.slice(0, body.at(-2) === '\r' ? -2 : -1);
    const el = html('pre',
      {
        class: params.lang ? `code language-${params.lang}` : 'text',
        translate: params.lang ? 'no' : undefined,
        'data-lang': params.lang || undefined,
        'data-line': params.line || undefined,
        'data-path': params.path || undefined,
      },
      params.lang
        ? input.caches?.code?.get(`${params.lang ?? ''}\n${src}`)?.cloneNode(true).childNodes ||
          src || undefined
        : undefined);
    output.append(new Node(el));
    if (params.lang) return;
    input.scope.focus(src);
    output.push();
    return output.context;
  },
  force(autolink),
  (input, output) => {
    input.scope.unfocus();
    const content = output.pop();
    output.peek().last!.value.replaceChildren(...defrag(unwrap(content)));
    return output.context;
  },
]));
