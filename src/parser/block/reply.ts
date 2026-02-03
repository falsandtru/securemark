import { ReplyParser } from '../block';
import { union, some, block, validate, rewrite, fmap } from '../../combinator';
import { cite, syntax as csyntax } from './reply/cite';
import { quote, syntax as qsyntax } from './reply/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { lineable } from '../util';
import { visualize, trimBlankNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

const delimiter = new RegExp(String.raw`${csyntax.source}|${qsyntax.source}`);

export const reply: ReplyParser = block(validate(csyntax, fmap(
  some(union([
    cite,
    quote,
    rewrite(
      some(anyline, delimiter),
      visualize(lineable(some(inline), true))),
  ])),
  ns => [html('p', trimBlankNodeEnd(defrag(ns)))])));
