import { TemplateParser } from '../inline';
import { Recursion, Backtrack } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { unwrap, invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const template: TemplateParser = lazy(() => surround(
  str('{{'),
  precedence(1,
  some(union([bracket, escsource]), '}')),
  str('}}'),
  true, [],
  ([as, bs = new List(), cs]) => new List([
    new Node(html('span', { class: 'template' }, defrag(unwrap(as.import(bs as List<Node<string>>).import(cs)))))
  ]),
  ([, bs], context) =>
    bs && new List([
      new Node(html('span',
        {
          class: 'invalid',
          ...invalid('template', 'syntax', `Missing the closing symbol "}}"`),
        },
        context.source.slice(context.position - context.range!, context.position)))
    ])));

const bracket: TemplateParser.BracketParser = lazy(() => union([
  surround(str('('), recursion(Recursion.terminal, some(union([bracket, escsource]), ')')), str(')'),
    true, [3 | Backtrack.escapable], undefined, () => new List()),
  surround(str('['), recursion(Recursion.terminal, some(union([bracket, escsource]), ']')), str(']'),
    true, [3 | Backtrack.escapable], undefined, () => new List()),
  surround(str('{'), recursion(Recursion.terminal, some(union([bracket, escsource]), '}')), str('}'),
    true, [3 | Backtrack.escapable], undefined, () => new List()),
  surround(
    str('"'),
    precedence(2, recursion(Recursion.terminal, some(escsource, /["\n]/y, [['"', 2], ['\n', 3]]))),
    str('"'),
    true,
    [3 | Backtrack.escapable],
    undefined,
    ([as, bs]) => bs && as.import(bs as List<Node<string>>)),
]));
