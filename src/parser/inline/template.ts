import { TemplateParser } from '../inline';
import { State, Recursion, Backtrack } from '../context';
import { union, some, syntax, creation, precedence, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { unshift } from 'spica/array';
import { html } from 'typed-dom/dom';

export const template: TemplateParser = lazy(() => creation(1, Recursion.ignore, surround(
  '{{',
  syntax(1, State.all, some(union([bracket, escsource]), '}')),
  '}}',
  true,
  ([, ns = []], rest) => [[html('span', { class: 'template' }, `{{${ns.join('').replace(/\x1B/g, '')}}}`)], rest],
  undefined, 3 | Backtrack.template)));

const bracket: TemplateParser.BracketParser = lazy(() => creation(0, Recursion.terminal, union([
  surround(str('('), some(union([bracket, escsource]), ')'), str(')'), true,
    undefined, ([as, bs = []], rest) => [unshift(as, bs), rest], 3 | Backtrack.template),
  surround(str('['), some(union([bracket, escsource]), ']'), str(']'), true,
    undefined, ([as, bs = []], rest) => [unshift(as, bs), rest], 3 | Backtrack.template),
  surround(str('{'), some(union([bracket, escsource]), '}'), str('}'), true,
    undefined, ([as, bs = []], rest) => [unshift(as, bs), rest], 3 | Backtrack.template),
  surround(str('"'), precedence(2, some(escsource, /^"|^\\?\n/)), str('"'), true,
    undefined, undefined, 3 | Backtrack.template),
])));
