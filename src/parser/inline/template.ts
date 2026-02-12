import { TemplateParser } from '../inline';
import { Recursion, Backtrack } from '../context';
import { union, some, recursion, precedence, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { html } from 'typed-dom/dom';

export const template: TemplateParser = lazy(() => surround(
  '{{',
  precedence(1,
  some(union([bracket, escsource]), '}')),
  '}}',
  true,
  ([, ns = []], rest, context) =>
    context.linebreak === undefined
      ? [[html('span', { class: 'template' }, `{{${ns.join('')}}}`)], rest]
      : undefined,
  undefined,
  [3 | Backtrack.doublebracket, 1 | Backtrack.bracket]));

const bracket: TemplateParser.BracketParser = lazy(() => union([
  surround(str('('), recursion(Recursion.terminal, some(union([bracket, escsource]), ')')), str(')'), true,
    undefined, () => [[], ''], [3 | Backtrack.escbracket]),
  surround(str('['), recursion(Recursion.terminal, some(union([bracket, escsource]), ']')), str(']'), true,
    undefined, () => [[], ''], [3 | Backtrack.escbracket]),
  surround(str('{'), recursion(Recursion.terminal, some(union([bracket, escsource]), '}')), str('}'), true,
    undefined, () => [[], ''], [3 | Backtrack.escbracket]),
  surround(str('"'), precedence(2, recursion(Recursion.terminal, some(escsource, '"'))), str('"'), true,
    undefined, () => [[], ''], [3 | Backtrack.escbracket]),
]));
