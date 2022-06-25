import { undefined } from 'spica/global';
import { BracketParser } from '../inline';
import { union, some, syntax, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { Rule } from '../context';
import { html, defrag } from 'typed-dom/dom';
import { unshift, push } from 'spica/array';

const index = /^[0-9A-Za-z]+(?:(?:[.-]|, )[0-9A-Za-z]+)*/;

export const bracket: BracketParser = lazy(() => union([
  syntax(Rule.none, 2, surround(str('('), str(index), str(')'))),
  syntax(Rule.bracket, 2, surround(str('('), some(inline, ')', [[')', 2]]), str(')'), true,
    ([as, bs = [], cs], rest) => [[html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))], rest],
    ([as, bs = []], rest) => [unshift([''], unshift(as, bs)), rest])),
  syntax(Rule.none, 2, surround(str('（'), str(new RegExp(index.source.replace(', ', '[，、]').replace(/[09AZaz.]|\-(?!\w)/g, c => c.trimStart() && String.fromCharCode(c.charCodeAt(0) + 0xFEE0)))), str('）'))),
  syntax(Rule.bracket, 2, surround(str('（'), some(inline, '）', [['）', 2]]), str('）'), true,
    ([as, bs = [], cs], rest) => [[html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))], rest],
    ([as, bs = []], rest) => [unshift(as, bs), rest])),
  syntax(Rule.bracket, 2, surround(str('['), some(inline, ']', [[']', 2]]), str(']'), true,
    undefined,
    ([as, bs = []], rest) => [unshift([''], unshift(as, bs)), rest])),
  syntax(Rule.bracket, 2, surround(str('{'), some(inline, '}', [['}', 2]]), str('}'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest])),
  // Control media blinking in editing rather than control confusion of pairs of quote marks.
  syntax(Rule.quote, 8, surround(str('"'), some(inline, '"', [['"', 8]]), str('"'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest])),
]));
