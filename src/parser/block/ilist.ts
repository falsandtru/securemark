import { IListParser } from '../block';
import { union, inits, some, block, line, validate, surround, convert, indent, trim, lazy, fmap, eval } from '../../combinator';
import { ulist_ } from './ulist';
import { olist_ } from './olist';
import { inline } from '../inline';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const ilist: IListParser = lazy(() => block(fmap(validate(
  /^[-+*]([^\S\n]|\n[^\S\n]*\S)/,
  some(union([
    fmap(
      inits([
        line(surround(/^[-+*](?:\s|$)/, defrag(trim(some(inline))), '', false)),
        indent(union([ulist_, olist_, ilist_]))
      ]),
      () => [html('li', eval(defrag(some(inline))('Invalid syntax: UList: Use `-` instead.')))]),
  ]))),
  es => [html('ul', { class: 'invalid', 'data-invalid-syntax': 'list', 'data-invalid-type': 'syntax' }, es)])));

export const ilist_: IListParser = convert(
  source => source.replace(/^[-+*](?=\n|$)/, `$& `),
  ilist);
