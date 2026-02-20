import { ReplyParser } from '../block';
import { union, some, block, validate, rewrite, fmap } from '../../combinator';
import { cite, syntax as csyntax } from './reply/cite';
import { quote, syntax as qsyntax } from './reply/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { linearize } from '../util';
import { visualize, trimBlankNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

const delimiter = new RegExp(`${csyntax.source}|${qsyntax.source}`, 'y');

export const reply: ReplyParser = block(validate(csyntax, fmap(
  some(union([
    cite,
    quote,
    rewrite(
      some(anyline, delimiter),
      visualize(linearize(some(inline), 1))),
  ])),
  ns => [html('p', trimBlankNodeEnd(defrag(ns)))])));
