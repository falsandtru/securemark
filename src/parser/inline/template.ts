import { TemplateParser } from '../inline';
import { Recursion, Backtrack, Command } from '../context';
import { union, some, recursion, precedence, verify, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { html } from 'typed-dom/dom';

export const template: TemplateParser = lazy(() => surround(
  '{{',
  precedence(1,
  some(verify(union([bracket, escsource]), ns => ns[0] !== Command.Escape), '}', [['\n', 9]])),
  '}}',
  true,
  ([, ns = []], rest) => [[html('span', { class: 'template' }, `{{${ns.join('')}}}`)], rest],
  undefined, [3 | Backtrack.linedoublebracket, 1 | Backtrack.lineescbracket], Backtrack.bracket));

const bracket: TemplateParser.BracketParser = lazy(() => union([
  surround(str('('), recursion(Recursion.terminal, some(union([bracket, escsource]), ')')), str(')'), true,
    undefined, () => [[Command.Escape], ''], [3 | Backtrack.lineescbracket]),
  surround(str('['), recursion(Recursion.terminal, some(union([bracket, escsource]), ']')), str(']'), true,
    undefined, () => [[Command.Escape], ''], [3 | Backtrack.lineescbracket]),
  surround(str('{'), recursion(Recursion.terminal, some(union([bracket, escsource]), '}')), str('}'), true,
    undefined, () => [[Command.Escape], ''], [3 | Backtrack.lineescbracket]),
  surround(str('"'), precedence(2, recursion(Recursion.terminal, some(escsource, '"'))), str('"'), true,
    undefined, () => [[Command.Escape], ''], [3 | Backtrack.lineescbracket]),
]));
