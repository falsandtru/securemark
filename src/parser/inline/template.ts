import { undefined } from 'spica/global';
import { TemplateParser } from '../inline';
import { union, some, syntax, creation, precedence, surround, lazy } from '../../combinator';
import { optimize } from './link';
import { escsource, str } from '../source';
import { Syntax } from '../context';
import { html } from 'typed-dom/dom';
import { unshift } from 'spica/array';

export const template: TemplateParser = lazy(() => surround(
  '{{', syntax(Syntax.none, 2, 1, some(union([bracket, escsource]), '}')), '}}', true,
  ([, ns = []], rest) => [[html('span', { class: 'template' }, `{{${ns.join('').replace(/\x1B/g, '')}}}`)], rest],
  ([, ns = [], rest], next, context) => next[0] === '}' ? undefined : optimize('{{', ns, rest, next, context)));

const bracket: TemplateParser.BracketParser = lazy(() => creation(union([
  surround(str('('), some(union([bracket, escsource]), ')'), str(')'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), some(union([bracket, escsource]), ']'), str(']'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), some(union([bracket, escsource]), '}'), str('}'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('"'), precedence(8, some(escsource, /^"|^\\?\n/)), str('"'), true),
])));
