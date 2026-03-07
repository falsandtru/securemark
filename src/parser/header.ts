import { MarkdownParser } from '../../markdown';
import { List, Data } from '../combinator/data/parser';
import { union, inits, some, block, line, validate, focus, clear, convert, lazy, fmap } from '../combinator';
import { str } from './source';
import { unwrap, invalid } from './util';
import { normalize } from './api/normalize';
import { html, defrag } from 'typed-dom/dom';

export const header: MarkdownParser.HeaderParser = lazy(() => validate(
  /---+ *\r?\n(?=\S)/y,
  inits([
    block(
      union([
        validate(({ context }) => context.header ?? true,
        focus(/(---+) *\r?\n(?:[A-Za-z][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*:[ \t]+\S[^\r\n]*\r?\n){1,100}\1 *(?:$|\r?\n)/y,
        convert(source =>
          normalize(source.slice(source.indexOf('\n') + 1, source.trimEnd().lastIndexOf('\n'))),
          fmap(
            some(union([field])),
            ns => new List([
              new Data(html('aside', { class: 'header' }, [
                html('details',
                  { open: '' },
                  defrag(unwrap(ns.unshift(new Data(html('summary', 'Header'))) && ns))),
              ])),
            ]))))),
        ({ context }) => {
          const { source, position } = context;
          context.position += source.length;
          return new List([
            new Data(html('pre', {
              class: 'invalid',
              translate: 'no',
              ...invalid('header', 'syntax', 'Invalid syntax'),
            }, normalize(source.slice(position)))),
          ]);
        },
      ])),
    clear(str(/ *\r?\n/y)),
  ])));

const field: MarkdownParser.HeaderParser.FieldParser = line(({ context: { source, position } }) => {
  const name = source.slice(position, source.indexOf(':', position));
  const value = source.slice(position + name.length + 1).trim();
  return new List([
    new Data(html('span', { class: 'field', 'data-name': name.toLowerCase(), 'data-value': value }, [
      html('span', { class: 'field-name' }, name),
      ': ',
      html('span', { class: 'field-value' }, value),
      '\n',
    ])),
  ]);
});
