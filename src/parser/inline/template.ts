import { TemplateParser } from '../inline';
import { Recursion } from '../context';
import { List, Node } from '../../combinator/parser';
import { union, some, recursion, precedence, backtrack, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { unwrap, invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const template: TemplateParser = lazy(() => backtrack(surround(
  str('{{'),
  precedence(1,
  some(union([bracket, escsource]), '}')),
  str('}}'),
  true, [],
  ([as, bs = new List(), cs], _, output) =>
    output.append(new Node(
      html('span', { class: 'template' }, defrag(unwrap(as.import(bs as List<Node<string>>).import(cs)))))),
  ([, bs], input, output) =>
    bs && output.append(
      new Node(html('span',
        {
          class: 'invalid',
          ...invalid('template', 'syntax', `Missing the closing symbol "}}"`),
        },
        input.source.slice(input.position - input.range, input.position)))))));

const bracket: TemplateParser.BracketParser = lazy(() => union([
  surround(str('('), recursion(Recursion.terminal, some(union([bracket, escsource]), ')')), str(')'),
    true, [], undefined, ([as, bs], _, output) => bs && output.import(as.import(bs as List<Node<string>>))),
  surround(str('['), recursion(Recursion.terminal, some(union([bracket, escsource]), ']')), str(']'),
    true, [], undefined, ([as, bs], _, output) => bs && output.import(as.import(bs as List<Node<string>>))),
  surround(str('{'), recursion(Recursion.terminal, some(union([bracket, escsource]), '}')), str('}'),
    true, [], undefined, ([as, bs], _, output) => bs && output.import(as.import(bs as List<Node<string>>))),
  surround(
    str('"'),
    precedence(2, recursion(Recursion.terminal, some(escsource, /["\n]/y, [['"', 2], ['\n', 3]]))),
    str('"'),
    true, [], undefined, ([as, bs], _, output) => bs && output.import(as.import(bs as List<Node<string>>))),
]));
