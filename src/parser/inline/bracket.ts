import { BracketParser } from '../inline';
import { union, some, syntax, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { Syntax, State } from '../context';
import { unshift, push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

const index = /^[0-9A-Za-z]+(?:(?:[.-]|, )[0-9A-Za-z]+)*/;

export const bracket: BracketParser = lazy(() => union([
  surround(str('('), syntax(Syntax.none, 2, 1, State.none, str(index)), str(')')),
  surround(str('('), syntax(Syntax.bracket, 2, 1, State.none, some(inline, ')', [[')', 2]])), str(')'), true,
    ([as, bs = [], cs], rest) => [[html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))], rest],
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('（'), syntax(Syntax.none, 2, 1, State.none, str(new RegExp(index.source.replace(', ', '[，、]').replace(/[09AZaz.]|\-(?!\w)/g, c => c.trimStart() && String.fromCharCode(c.charCodeAt(0) + 0xFEE0))))), str('）')),
  surround(str('（'), syntax(Syntax.bracket, 2, 1, State.none, some(inline, '）', [['）', 2]])), str('）'), true,
    ([as, bs = [], cs], rest) => [[html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))], rest],
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), syntax(Syntax.bracket, 2, 1, State.none, some(inline, ']', [[']', 2]])), str(']'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), syntax(Syntax.bracket, 2, 1, State.none, some(inline, '}', [['}', 2]])), str('}'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  // Control media blinking in editing rather than control confusion of pairs of quote marks.
  surround(str('"'), syntax(Syntax.none, 3, 1, State.none, some(inline, '"', [['"', 3]])), str('"'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
]));
