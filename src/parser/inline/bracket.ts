import { undefined } from 'spica/global';
import { BracketParser } from '../inline';
import { union, some, creator, precedence, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { html, defrag } from 'typed-dom/dom';
import { unshift, push } from 'spica/array';

const index = /^[0-9A-Za-z]+(?:(?:[.-]|, )[0-9A-Za-z]+)*/;

export const bracket: BracketParser = lazy(() => creator(0, union([
  surround(str('('), precedence(2, str(index)), str(')')),
  surround(str('('), precedence(2, some(inline, ')', [[')', 2]])), str(')'), true,
    ([as, bs = [], cs], rest) => [[html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))], rest],
    ([as, bs = []], rest) => [unshift([''], unshift(as, bs)), rest]),
  surround(str('（'), precedence(2, str(new RegExp(index.source.replace(', ', '[，、]').replace(/[09AZaz.]|\-(?!\w)/g, c => c.trimStart() && String.fromCharCode(c.charCodeAt(0) + 0xFEE0))))), str('）')),
  surround(str('（'), precedence(2, some(inline, '）', [['）', 2]])), str('）'), true,
    ([as, bs = [], cs], rest) => [[html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))], rest],
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), precedence(2, some(inline, ']', [[']', 2]])), str(']'), true,
    undefined,
    ([as, bs = []], rest) => [unshift([''], unshift(as, bs)), rest]),
  surround(str('{'), precedence(2, some(inline, '}', [['}', 2]])), str('}'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  // Control media blinking in editing rather than control confusion of pairs of quote marks.
  surround(str('"'), precedence(8, some(inline, '"', [['"', 8]])), str('"'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
])));
