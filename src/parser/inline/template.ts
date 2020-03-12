import { TemplateParser } from '../inline';
import { union, some, rewrite, creator, surround, lazy } from '../../combinator';
import { escsource, str, char } from '../source';
import { html } from 'typed-dom';
import { unshift } from 'spica/array';

export const template: TemplateParser = lazy(() => creator(rewrite(
  surround('{{', some(union([bracket, escsource]), '}'), '}}', true),
  source => [[html('span', { class: 'template' }, source)], ''])));

const bracket: TemplateParser.BracketParser = lazy(() => creator(union([
  surround(char('('), some(union([bracket, str(/^(?:\\[^\s\S]?|[^\)([{<"\\])+/)])), char(')'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('['), some(union([bracket, str(/^(?:\\[^\s\S]?|[^\]([{<"\\])+/)])), char(']'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('{'), some(union([bracket, str(/^(?:\\[^\s\S]?|[^\}([{<"\\])+/)])), char('}'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('<'), some(union([bracket, str(/^(?:\\[^\s\S]?|[^\>([{<"\\])+/)])), char('>'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('"'), str(/^(?:\\[^\n]?|[^\n"])+/), char('"'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
])));
