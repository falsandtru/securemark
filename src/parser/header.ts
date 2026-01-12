import { MarkdownParser } from '../../markdown';
import { union, inits, some, block, line, validate, focus, rewrite, clear, convert, lazy, fmap } from '../combinator';
import { segment } from './segment';
import { str } from './source';
import { normalize } from './api/normalize';
import { html, defrag } from 'typed-dom/dom';

export const header: MarkdownParser.HeaderParser = lazy(() => validate(
  /^---+[^\S\v\f\r\n]*\r?\n[^\S\n]*(?=\S)/,
  inits([
    rewrite(
      ({ source, context }) =>
        [[], context.header ?? true ? source.slice(segment(source).next().value!.length) : ''],
      block(
        union([
          validate(({ context }) => context.header ?? true,
          focus(/^---[^\S\v\f\r\n]*\r?\n(?:[A-Za-z][0-9A-Za-z]*(?:-[A-Za-z][0-9A-Za-z]*)*:[ \t]+\S[^\v\f\r\n]*\r?\n){1,100}---[^\S\v\f\r\n]*(?:$|\r?\n)/,
          convert(source =>
            normalize(source.slice(source.indexOf('\n') + 1, source.trimEnd().lastIndexOf('\n'))).replace(/(\S)\s+$/mg, '$1'),
            fmap(
              some(union([field])),
              es => [
                html('aside', { class: 'header' }, [
                  html('details', { open: '' }, defrag([
                    html('summary', 'Header'),
                    ...es,
                  ])),
                ]),
              ])))),
          ({ source }) => [[
            html('pre', {
              class: 'invalid',
              translate: 'no',
              'data-invalid-syntax': 'header',
              'data-invalid-type': 'syntax',
              'data-invalid-message': 'Invalid syntax',
            }, normalize(source)),
          ], ''],
        ]))),
    clear(str(/^[^\S\v\f\r\n]*\r?\n/)),
  ])));

const field: MarkdownParser.HeaderParser.FieldParser = line(({ source }) => {
  const name = source.slice(0, source.indexOf(':'));
  const value = source.slice(name.length + 1).trim();
  return [[
    html('span', { class: 'field', 'data-name': name.toLowerCase(), 'data-value': value }, [
      html('span', { class: 'field-name' }, name),
      ': ',
      html('span', { class: 'field-value' }, value),
      '\n',
    ]),
  ], ''];
});
