import { TemplateParser } from '../inline';
import { Recursion, Backtrack } from '../context';
import { union, some, recursion, precedence, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { invalid } from '../util';
import { unshift, push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const template: TemplateParser = lazy(() => surround(
  str('{{'),
  precedence(1,
  some(union([bracket, escsource]), '}')),
  str('}}'),
  true,
  ([as, bs = [], cs]) =>
    [[html('span', { class: 'template' }, defrag(push(unshift(as, bs), cs)))]],
  ([, bs], context) =>
    bs && [[
      html('span',
        {
          class: 'invalid',
          ...invalid('template', 'syntax', `Missing the closing symbol "}}"`),
        },
        context.source.slice(context.position - context.range!, context.position))
    ]],
  [3 | Backtrack.doublebracket, 3 | Backtrack.escbracket]));

const bracket: TemplateParser.BracketParser = lazy(() => union([
  surround(str('('), recursion(Recursion.terminal, some(union([bracket, escsource]), ')')), str(')'), true,
    undefined, () => [[]], [3 | Backtrack.escbracket]),
  surround(str('['), recursion(Recursion.terminal, some(union([bracket, escsource]), ']')), str(']'), true,
    undefined, () => [[]], [3 | Backtrack.escbracket]),
  surround(str('{'), recursion(Recursion.terminal, some(union([bracket, escsource]), '}')), str('}'), true,
    undefined, () => [[]], [3 | Backtrack.escbracket]),
  surround(
    str('"'),
    precedence(2, recursion(Recursion.terminal, some(escsource, '"', [['"', 2, false]]))),
    str('"'),
    true,
    ([as, bs = [], cs], context) =>
      context.linebreak === 0
        ? [push(unshift(as, bs), cs)]
        : (context.position -= 1, [unshift(as, bs)]),
    ([as, bs]) => bs && [unshift(as, bs)],
    [3 | Backtrack.escbracket]),
]));
