import { IListParser } from '../block';
import { union, inits, some, block, line, validate, indent, rewrite, context, creator, open, convert, trim, fallback, lazy, fmap } from '../../combinator';
import { ulist_, fillFirstLine } from './ulist';
import { olist_ } from './olist';
import { inline } from '../inline';
import { contentline } from '../source';
import { html, defrag } from 'typed-dom';

export const ilist: IListParser = lazy(() => block(fmap(validate(
  /^[-+*](?=[^\S\n]|\n[^\S\n]*\S)/,
  context({ syntax: { inline: { media: false } } },
  some(creator(union([
    fmap(fallback(
      inits([
        line(open(/^[-+*](?:$|\s)/, trim(some(inline)), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      rewrite(contentline, source => [[html('span', source.replace('\n', ''))], ''])),
      ns => [html('li', defrag(fillFirstLine(ns)))]),
  ]))))),
  es => [
    html('ul', {
      class: 'invalid',
      'data-invalid-syntax': 'list',
      'data-invalid-type': 'syntax',
      'data-invalid-description': 'Use "-" instead of "+" or "*".',
    }, es),
  ])));

export const ilist_: IListParser = convert(
  source => source.replace(/^[-+*](?=$|\n)/, `$& `),
  ilist);
