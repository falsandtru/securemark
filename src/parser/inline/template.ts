import { TemplateParser } from '../inline';
import { union, some, syntax, creation, precedence, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { Syntax, State } from '../context';
import { unshift } from 'spica/array';
import { html } from 'typed-dom/dom';

export const template: TemplateParser = lazy(() => creation(surround(
  '{{',
  syntax(Syntax.none, 6, State.all, some(union([bracket, escsource]), '}', [['}}', 6]])),
  '}}',
  true,
  ([, ns = []], rest) => [[html('span', { class: 'template' }, `{{${ns.join('').replace(/\x1B/g, '')}}}`)], rest])));

const bracket: TemplateParser.BracketParser = lazy(() => creation(union([
  surround(str('('), some(union([bracket, escsource]), ')'), str(')'), true,
    undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), some(union([bracket, escsource]), ']'), str(']'), true,
    undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), some(union([bracket, escsource]), '}'), str('}'), true,
    undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('"'), precedence(3, some(escsource, /^"|^\\?\n/)), str('"'), true),
])));
