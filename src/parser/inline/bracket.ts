import { BracketParser } from '../inline';
import { Recursion, Backtrack } from '../context';
import { union, some, recursion, precedence, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { unshift, push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

const indexA = /^[0-9A-Za-z]+(?:(?:[.-]|, )[0-9A-Za-z]+)*$/;
const indexF = new RegExp(indexA.source.replace(', ', '[，、]')
  .replace(/[09AZaz.]|\-(?!\w)/g, c => String.fromCodePoint(c.codePointAt(0)! + 0xFEE0)));

export const bracket: BracketParser = lazy(() => union([
  surround(str('('), recursion(Recursion.bracket, precedence(1, some(inline, ')', [[')', 1]]))), str(')'), true,
    ([as, bs = [], cs], rest, { recent = [] }) => [
      indexA.test(recent[1])
        ? recent
        : [html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))],
      rest
    ],
    ([as, bs = []], rest) => [unshift(as, bs), rest], [3 | Backtrack.bracket]),
  surround(str('（'), recursion(Recursion.bracket, precedence(1, some(inline, '）', [['）', 1]]))), str('）'), true,
    ([as, bs = [], cs], rest, { recent = [] }) => [
      indexF.test(recent[1])
        ? recent
        : [html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))],
      rest
    ],
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), recursion(Recursion.bracket, precedence(1, some(inline, ']', [[']', 1]]))), str(']'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest], [3 | Backtrack.bracket]),
  surround(str('［'), recursion(Recursion.bracket, precedence(1, some(inline, '］', [['］', 1]]))), str('］'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), recursion(Recursion.bracket, precedence(1, some(inline, '}', [['}', 1]]))), str('}'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest], [3 | Backtrack.bracket]),
  surround(str('｛'), recursion(Recursion.bracket, precedence(1, some(inline, '｝', [['｝', 1]]))), str('｝'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  // 改行禁止はバックトラックなしでは内側の構文を破壊するため安易に行えない。
  surround(str('"'), recursion(Recursion.bracket, precedence(2, some(inline, '"', [['\n', 9], ['"', 2]]))), str('"'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest], [3 | Backtrack.bracket]),
]));
