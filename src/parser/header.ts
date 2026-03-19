import { MarkdownParser } from '../../markdown';
import { List, Node } from '../combinator/data/parser';
import { union, inits, some, block, line, validate, focus, clear, convert, lazy, fmap } from '../combinator';
import { str } from './source';
import { unwrap, invalid } from './util';
import { html, defrag } from 'typed-dom/dom';

export const header: MarkdownParser.HeaderParser = lazy(() => validate(
  /---+[^\S\r\n]*\r?\n(?=\S)/y,
  inits([
    block(
      union([
        validate(context => context.header,
        focus(/(---+)[^\S\r\n]*\r?\n(?:[a-z][0-9a-z]*(?:-[0-9a-z]+)*:[ \t]+\S[^\r\n]*\r?\n){1,100}\1[^\S\r\n]*(?:$|\r?\n)/yi,
        convert(source =>
          source.slice(source.indexOf('\n') + 1, source.trimEnd().lastIndexOf('\n')),
          fmap(
            some(union([field])),
            ns => new List([
              new Node(html('aside', { class: 'header' }, [
                html('details',
                  { open: '' },
                  defrag(unwrap(ns.unshift(new Node(html('summary', 'Header'))) && ns))),
              ])),
            ]))))),
        context => {
          const { source, position } = context;
          context.position += source.length;
          return new List([
            new Node(html('pre', {
              class: 'invalid',
              translate: 'no',
              ...invalid('header', 'syntax', 'Invalid syntax'),
            }, source.slice(position))),
          ]);
        },
      ])),
    clear(str(/[^\S\r\n]*\r?\n/y)),
  ])));

const field: MarkdownParser.HeaderParser.FieldParser = line(({ source, position }) => {
  const name = source.slice(position, source.indexOf(':', position));
  const value = source.slice(position + name.length + 1).trim();
  return new List([
    new Node(html('span', { class: 'field', 'data-name': name.toLowerCase(), 'data-value': value }, [
      html('span', { class: 'field-name' }, name),
      ': ',
      html('span', { class: 'field-value' }, value),
      '\n',
    ])),
  ]);
});
