import { TemplateParser } from '../inline';
import { Recursion, Backtrack, Command } from '../context';
import { union, some, creation, precedence, verify, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { html } from 'typed-dom/dom';

export const template: TemplateParser = lazy(() => creation(1, Recursion.ignore, surround(
  '{{',
  precedence(1, some(verify(union([bracket, escsource]), ns => ns[0] !== Command.Escape), '}')),
  '}}',
  true,
  ([, ns = []], rest) => [[html('span', { class: 'template' }, `{{${ns.join('')}}}`)], rest],
  undefined, 3 | Backtrack.template)));

const bracket: TemplateParser.BracketParser = lazy(() => creation(0, Recursion.terminal, union([
  surround(str('('), some(union([bracket, escsource]), ')'), str(')'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.template),
  surround(str('['), some(union([bracket, escsource]), ']'), str(']'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.template),
  surround(str('{'), some(union([bracket, escsource]), '}'), str('}'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.template),
  surround(str('"'), precedence(2, some(escsource, /^["\n]/)), str('"'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.template),
])));
