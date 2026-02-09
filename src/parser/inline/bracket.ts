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
  surround(
    str('('),
    precedence(1, recursion(Recursion.bracket, some(inline, ')', [[')', 1]]))),
    str(')'),
    true,
    ([as, bs = [], cs], rest, { recent = [] }) => [
      indexA.test(recent[1])
        ? recent
        : [html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))],
      rest
    ],
    ([as, bs = []], rest) => [unshift(as, bs), rest], [2 | Backtrack.bracket]),
  surround(
    str('（'),
    precedence(1, recursion(Recursion.bracket, some(inline, '）', [['）', 1]]))),
    str('）'),
    true,
    ([as, bs = [], cs], rest, { recent = [] }) => [
      indexF.test(recent[1])
        ? recent
        : [html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))],
      rest
    ],
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(
    str('['),
    precedence(1, recursion(Recursion.bracket, some(inline, ']', [[']', 1]]))),
    str(']'),
    true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest], [2 | Backtrack.bracket]),
  surround(
    str('［'),
    precedence(1, recursion(Recursion.bracket, some(inline, '］', [['］', 1]]))),
    str('］'),
    true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(
    str('{'),
    precedence(1, recursion(Recursion.bracket, some(inline, '}', [['}', 1]]))),
    str('}'),
    true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest], [2 | Backtrack.bracket]),
  surround(
    str('｛'),
    precedence(1, recursion(Recursion.bracket, some(inline, '｝', [['｝', 1]]))),
    str('｝'),
    true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  // 同一行内でしか閉じない以外括弧と同じ挙動
  surround(
    str('"'),
    precedence(2, recursion(Recursion.bracket, some(inline, '"', [['"', 2, false]]))),
    str('"'),
    true,
    ([as, bs = [], cs], rest, { linebreak = 0 }) =>
      linebreak > rest.length
        ? [unshift(as, bs), cs[0] + rest]
        : [push(unshift(as, bs), cs), rest],
    ([as, bs = []], rest) => [unshift(as, bs), rest], [2 | Backtrack.bracket]),
]));
