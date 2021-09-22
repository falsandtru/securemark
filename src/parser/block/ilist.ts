import { IListParser } from '../block';
import { union, inits, some, block, line, validate, indent, context, creator, open, convert, trim, lazy, fmap } from '../../combinator';
import { ulist_, fillFirstLine } from './ulist';
import { olist_ } from './olist';
import { inline } from '../inline';
import { html, defrag } from 'typed-dom';

export const ilist: IListParser = lazy(() => block(fmap(validate(
  /^[-+*](?=[^\S\n]|\n[^\S\n]*\S)/,
  context({ syntax: { inline: { media: false } } },
  some(creator(union([
    fmap(
      inits([
        line(open(/^[-+*](?:$|\s)/, trim(some(inline)), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      ns => [html('li', defrag(fillFirstLine(ns)))]),
  ]))))),
  es => [html('ul', { class: 'invalid', 'data-invalid-syntax': 'list', 'data-invalid-type': 'syntax', 'data-invalid-description': 'Use "-" instead of "+" or "*".' }, es)])));

export const ilist_: IListParser = convert(
  source => source.replace(/^[-+*](?=$|\n)/, `$& `),
  ilist);
