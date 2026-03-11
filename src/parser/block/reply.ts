import { ReplyParser } from '../block';
import { List, Node } from '../../combinator/data/parser';
import { Flag } from '../node';
import { union, some, block, validate, rewrite, fmap } from '../../combinator';
import { cite, syntax as csyntax } from './reply/cite';
import { quote, syntax as qsyntax } from './reply/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { visualize, trimBlankNodeEnd } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

const delimiter = new RegExp(`${csyntax.source}|${qsyntax.source}`, 'y');

export const reply: ReplyParser = block(validate(csyntax, fmap(
  some(union([
    cite,
    quote,
    rewrite(
      some(anyline, delimiter),
      visualize(fmap(some(inline), (ns, { source, position }) =>
        source[position - 1] === '\n'
          ? ns
          : ns.push(new Node(html('br'), Flag.blank)) && ns)))
  ])),
  ns => new List([new Node(html('p', defrag(unwrap(trimBlankNodeEnd(ns)))))]))));
