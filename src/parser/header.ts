import { MarkdownParser } from '../../markdown';
import { List, Node } from '../combinator/parser';
import { union, inits, some, scope, block, line, validate, focus, clear, lazy, fmap } from '../combinator';
import { str } from './source';
import { unwrap, invalid } from './util';
import { ReadonlyURL } from 'spica/url';
import { html, defrag } from 'typed-dom/dom';

export const header: MarkdownParser.HeaderParser = lazy(() => validate(
  /---+[^\S\r\n]*\r?\n(?=\S)/y,
  inits([
    block(
      union([
        validate(
          input => input.header,
          focus(/(---+)[^\S\r\n]*\r?\n(?:[a-z][0-9a-z]*(?:-[0-9a-z]+)*:[ \t]+\S[^\r\n]*\r?\n){1,32}\1[^\S\r\n]*(?:$|\r?\n)/yi,
            scope(
              ({ source }) => source.slice(source.indexOf('\n') + 1, source.trimEnd().lastIndexOf('\n')),
              fmap(
                some(union([field])),
                ns => new List([
                  new Node(html('aside', { class: 'header' }, [
                    html('details',
                      { open: '' },
                      defrag(unwrap(ns.unshift(new Node(html('summary', 'Header')))))),
                  ])),
                ])),
              false))),
        (input, output) => {
          const { source, position } = input;
          input.position += source.length;
          return output.append(
            new Node(html('pre', {
              class: 'invalid',
              translate: 'no',
              ...invalid('header', 'syntax', 'Invalid syntax'),
            }, source.slice(position))));
        },
      ])),
    clear(str(/[^\S\r\n]*\r?\n/y)),
  ])));

const field: MarkdownParser.HeaderParser.FieldParser = line((input, output) => {
  const { source, position } = input;
  const name = source.slice(position, source.indexOf(':', position));
  const value = source.slice(position + name.length + 1).trim();
  if (name.toLowerCase() === 'url') {
    // @ts-expect-error
    input.url = new ReadonlyURL(value as ':');
  }
  return output.append(
    new Node(html('div', { class: 'field', 'data-name': name.toLowerCase(), 'data-value': value }, [
      html('span', { class: 'field-name' }, name),
      ': ',
      html('span', { class: 'field-value' }, value),
    ])));
});
