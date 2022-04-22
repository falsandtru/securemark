import { undefined } from 'spica/global';
import { TemplateParser } from '../inline';
import { union, some, rewrite, creator, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { html } from 'typed-dom/dom';
import { unshift } from 'spica/array';

export const template: TemplateParser = lazy(() => creator(rewrite(
  surround('{{', some(union([bracket, escsource]), '}'), '}}', true),
  source => [[html('span', { class: 'template' }, source.replace(/\x1B/g, ''))], ''])));

const bracket: TemplateParser.BracketParser = lazy(() => union([
  surround(str('('), some(union([bracket, escsource]), ')'), str(')'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), some(union([bracket, escsource]), ']'), str(']'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), some(union([bracket, escsource]), '}'), str('}'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('"'), some(escsource, /^"|^\\?\n/), str('"'), true),
]));
