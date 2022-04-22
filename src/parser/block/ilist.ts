import { IListParser } from '../block';
import { union, inits, some, block, line, validate, indent, rewrite, context, creator, open, trim, fallback, lazy, fmap } from '../../combinator';
import { ulist_, fillFirstLine } from './ulist';
import { olist_ } from './olist';
import { inline } from '../inline';
import { contentline } from '../source';
import { html, defrag } from 'typed-dom/dom';

export const ilist: IListParser = lazy(() => block(validate(
  /^[-+*](?=[^\S\n]|\n[^\S\n]*\S)/,
  context({ syntax: { inline: { media: false } } },
  ilist_))));

export const ilist_: IListParser = lazy(() => block(fmap(validate(
  /^[-+*](?:$|\s)/,
  some(creator(union([
    fmap(fallback(
      inits([
        line(open(/^[-+*](?:$|\s)/, trim(some(inline)), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      rewrite(contentline, source => [[html('span', source.replace('\n', ''))], ''])),
      ns => [html('li', defrag(fillFirstLine(ns)))]),
  ])))),
  es => [
    html('ul', {
      class: 'invalid',
      'data-invalid-syntax': 'list',
      'data-invalid-type': 'syntax',
      'data-invalid-message': 'Use "-" instead of "+" or "*"',
    }, es),
  ])));
