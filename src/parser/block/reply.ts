import { ReplyParser } from '../block';
import { union, some, block, validate, rewrite, fmap } from '../../combinator';
import { cite, syntax as csyntax } from './reply/cite';
import { quote, syntax as qsyntax } from './reply/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { visualize, trimBlankNodeEnd } from '../visibility';
import { push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

const delimiter = new RegExp(`${csyntax.source}|${qsyntax.source}`, 'y');

export const reply: ReplyParser = block(validate(csyntax, fmap(
  some(union([
    cite,
    quote,
    rewrite(
      some(anyline, delimiter),
      visualize(fmap(some(inline), (ns, { source, position }) =>
        source[position - 1] === '\n' ? ns : push(ns, [html('br')])))),
  ])),
  ns => [html('p', trimBlankNodeEnd(defrag(ns)))])));
