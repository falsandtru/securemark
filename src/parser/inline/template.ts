import { TemplateParser } from '../inline';
import { Recursion, Backtrack } from '../context';
import { union, some, recursion, precedence, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { html } from 'typed-dom/dom';

export const template: TemplateParser = lazy(() => surround(
  '{{',
  precedence(1,
  some(union([bracket, escsource]), '}', [['\n', 9]])),
  '}}',
  true,
  ([, ns = []], rest) => [[html('span', { class: 'template' }, `{{${ns.join('')}}}`)], rest],
  undefined, [3 | Backtrack.linedoublebracket, 1 | Backtrack.lineescbracket]));

const bracket: TemplateParser.BracketParser = lazy(() => union([
  surround(str('('), recursion(Recursion.terminal, some(union([bracket, escsource]), ')')), str(')'), true,
    undefined, () => [[], ''], [3 | Backtrack.lineescbracket]),
  surround(str('['), recursion(Recursion.terminal, some(union([bracket, escsource]), ']')), str(']'), true,
    undefined, () => [[], ''], [3 | Backtrack.lineescbracket]),
  surround(str('{'), recursion(Recursion.terminal, some(union([bracket, escsource]), '}')), str('}'), true,
    undefined, () => [[], ''], [3 | Backtrack.lineescbracket]),
  surround(str('"'), precedence(2, recursion(Recursion.terminal, some(escsource, '"'))), str('"'), true,
    undefined, () => [[], ''], [3 | Backtrack.lineescbracket]),
]));
