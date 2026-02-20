import { MarkdownParser } from '../../markdown';
import { union, inits, some, block, line, validate, focus, rewrite, clear, convert, lazy, fmap } from '../combinator';
import { segment } from './segment';
import { str } from './source';
import { invalid } from './util';
import { normalize } from './api/normalize';
import { html, defrag } from 'typed-dom/dom';

export const header: MarkdownParser.HeaderParser = lazy(() => validate(
  /---+[^\S\v\f\r\n]*\r?\n[^\S\n]*(?=\S)/y,
  inits([
    rewrite(
      ({ context }) => {
        const { source } = context;
        if (context.header ?? true) {
          context.position += segment(source).next().value!.length;
        }
        else {
          context.position = source.length;
        }
        return [[]];
      },
      block(
        union([
          validate(({ context }) => context.header ?? true,
          focus(/---[^\S\v\f\r\n]*\r?\n(?:[A-Za-z][0-9A-Za-z]*(?:-[A-Za-z][0-9A-Za-z]*)*:[ \t]+\S[^\v\f\r\n]*\r?\n){1,100}---[^\S\v\f\r\n]*(?:$|\r?\n)/y,
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
              ]), false))),
          ({ context }) => {
            const { source, position } = context;
            context.position += source.length;
            return [[
              html('pre', {
                class: 'invalid',
                translate: 'no',
                ...invalid('header', 'syntax', 'Invalid syntax'),
              }, normalize(source.slice(position))),
            ]];
          },
        ]))),
    clear(str(/[^\S\v\f\r\n]*\r?\n/y)),
  ])));

const field: MarkdownParser.HeaderParser.FieldParser = line(({ context: { source, position } }) => {
  const name = source.slice(position, source.indexOf(':', position));
  const value = source.slice(position + name.length + 1).trim();
  return [[
    html('span', { class: 'field', 'data-name': name.toLowerCase(), 'data-value': value }, [
      html('span', { class: 'field-name' }, name),
      ': ',
      html('span', { class: 'field-value' }, value),
      '\n',
    ]),
  ]];
});
