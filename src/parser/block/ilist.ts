import { IListParser } from '../block';
import { Parser } from '../../combinator/data/parser';
import { Recursion } from '../context';
import { union, inits, some, recursion, block, line, validate, indent, rewrite, open, fallback, lazy, fmap } from '../../combinator';
import { ulist_, fillFirstLine } from './ulist';
import { olist_ } from './olist';
import { inline } from '../inline';
import { contentline } from '../source';
import { visualize, trimBlank } from '../visibility';
import { invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const ilist: IListParser = lazy(() => block(validate(
  /[-+*] /y,
  ilist_)));

export const ilist_: IListParser = lazy(() => block(fmap(validate(
  /[-+*](?:$|[ \n])/y,
  some(recursion(Recursion.listitem, union([
    fmap(fallback(
      inits([
        line(open(/[-+*](?:$|[ \n])/y, trimBlank(visualize(some(inline))), true)),
        indent(union([ulist_, olist_, ilist_])),
      ]),
      ilistitem),
      ns => [html('li', defrag(fillFirstLine(ns)))]),
  ])))),
  es => [
    html('ul', {
      class: 'invalid',
      ...invalid('list', 'syntax', 'Use "-" instead of "+" or "*"'),
    }, es),
  ])));

export const ilistitem = rewrite(
  inits([contentline, indent<Parser<string>>(({ context: { source } }) => [[source]])]),
  ({ context: { source } }) => [[
    '',
    html('span', {
      class: 'invalid',
      ...invalid('list', 'syntax', 'Fix the indent or the head of the list item'),
    }, source.replace('\n', ''))
  ]]);
