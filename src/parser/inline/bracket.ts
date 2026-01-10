import { BracketParser } from '../inline';
import { union, some, syntax, creation, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { State, Recursion, Backtrack } from '../context';
import { unshift, push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

const indexA = /^[0-9A-Za-z]+(?:(?:[.-]|, )[0-9A-Za-z]+)*/;
const indexF = new RegExp(indexA.source.replace(', ', '[，、]')
  .replace(/[09AZaz.]|\-(?!\w)/g, c => String.fromCodePoint(c.codePointAt(0)! + 0xFEE0)));

export const bracket: BracketParser = lazy(() => union([
  surround(str('('), creation(0, Recursion.bracket, syntax(2, State.none, str(indexA))), str(')')),
  surround(str('('), creation(0, Recursion.bracket, syntax(2, State.none, some(inline, ')', [[')', 2]]))), str(')'), true,
    ([as, bs = [], cs], rest) => [[html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))], rest],
    ([as, bs = []], rest) => [unshift(as, bs), rest], 3 | Backtrack.bracket),
  surround(str('（'), creation(0, Recursion.bracket, syntax(2, State.none, str(indexF))), str('）')),
  surround(str('（'), creation(0, Recursion.bracket, syntax(2, State.none, some(inline, '）', [['）', 2]]))), str('）'), true,
    ([as, bs = [], cs], rest) => [[html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))], rest],
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), creation(0, Recursion.bracket, syntax(2, State.none, some(inline, ']', [[']', 2]]))), str(']'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest], 3 | Backtrack.bracket),
  surround(str('［'), creation(0, Recursion.bracket, syntax(2, State.none, some(inline, '］', [['］', 2]]))), str('］'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), creation(0, Recursion.bracket, syntax(2, State.none, some(inline, '}', [['}', 2]]))), str('}'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest], 3 | Backtrack.bracket),
  surround(str('｛'), creation(0, Recursion.bracket, syntax(2, State.none, some(inline, '｝', [['｝', 2]]))), str('｝'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  // 改行禁止はバックトラックなしでは内側の構文を破壊するため安易に行えない。
  surround(str('"'), creation(0, Recursion.bracket, syntax(3, State.none, some(inline, '"', [[/^\\?\n/, 9], ['"', 3]]))), str('"'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('“'), creation(0, Recursion.bracket, syntax(3, State.none, some(inline, '”', [[/^\\?\n/, 9], ['”', 3]]))), str('”'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('‘'), creation(0, Recursion.bracket, syntax(3, State.none, some(inline, '’', [[/^\\?\n/, 9], ['’', 3]]))), str('’'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('「'), creation(0, Recursion.bracket, syntax(3, State.none, some(inline, '」', [[/^\\?\n/, 9], ['」', 3]]))), str('」'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('『'), creation(0, Recursion.bracket, syntax(3, State.none, some(inline, '』', [[/^\\?\n/, 9], ['』', 3]]))), str('』'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
]));
