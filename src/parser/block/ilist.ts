import { IListParser } from '../block';
import { Recursion } from '../context';
import { union, inits, some, creation, block, line, validate, indent, open, trim, fallback, lazy, fmap } from '../../combinator';
import { ulist_, invalid, fillFirstLine } from './ulist';
import { olist_ } from './olist';
import { inline } from '../inline';
import { lineable } from '../util';
import { visualize, trimBlank } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const ilist: IListParser = lazy(() => block(validate(
  /^[-+*](?=[^\S\n]|\n[^\S\n]*\S)/,
  ilist_)));

export const ilist_: IListParser = lazy(() => block(fmap(validate(
  /^[-+*](?:$|\s)/,
  some(creation(0, Recursion.listitem, union([
    fmap(fallback(
      inits([
        line(open(/^[-+*](?:$|\s)/, trim(visualize(trimBlank(lineable(some(inline))))), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      invalid),
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
