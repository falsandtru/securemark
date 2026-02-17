import { BracketParser } from '../inline';
import { State, Recursion, Backtrack } from '../context';
import { union, some, recursion, precedence, surround, isBacktrack, setBacktrack, lazy } from '../../combinator';
import { inline } from '../inline';
import { textlink } from './link';
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
    ([as, bs = [], cs], { recent = [] }) => [
      indexA.test(recent[1])
        ? recent
        : [html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))],
    ],
    ([as, bs = []]) => [unshift(as, bs)],
    [2 | Backtrack.bracket]),
  surround(
    str('（'),
    precedence(1, recursion(Recursion.bracket, some(inline, '）', [['）', 1]]))),
    str('）'),
    true,
    ([as, bs = [], cs], { recent = [] }) => [
      indexF.test(recent[1])
        ? recent
        : [html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))],
    ],
    ([as, bs = []]) => [unshift(as, bs)]),
  surround(
    str('['),
    precedence(1, recursion(Recursion.bracket, some(inline, ']', [[']', 1]]))),
    str(']'),
    true,
    ([as, bs = [], cs], context) => {
      if (context.state! & State.link) {
        const { source, position, recent = [] } = context;
        const head = position - recent.reduce((a, b) => a + b.length, 0);
        if (context.linebreak !== 0 || source[position] !== '{') {
          setBacktrack(context, [2 | Backtrack.link], head);
        }
        else {
          context.state! ^= State.link;
          const result = !isBacktrack(context, [1 | Backtrack.link])
            ? textlink({ context })
            : undefined;
          context.position = position;
          if (!result) {
            setBacktrack(context, [2 | Backtrack.link], head);
          }
          context.state! ^= State.link;
          context.recent = recent;
        }
      }
      return [push(unshift(as, bs), cs)];
    },
    ([as, bs = []]) => [unshift(as, bs)],
    [2 | Backtrack.bracket]),
  surround(
    str('［'),
    precedence(1, recursion(Recursion.bracket, some(inline, '］', [['］', 1]]))),
    str('］'),
    true,
    undefined,
    ([as, bs = []]) => [unshift(as, bs)]),
  surround(
    str('{'),
    precedence(1, recursion(Recursion.bracket, some(inline, '}', [['}', 1]]))),
    str('}'),
    true,
    undefined,
    ([as, bs = []]) => [unshift(as, bs)],
    [2 | Backtrack.bracket]),
  surround(
    str('｛'),
    precedence(1, recursion(Recursion.bracket, some(inline, '｝', [['｝', 1]]))),
    str('｝'),
    true,
    undefined,
    ([as, bs = []]) => [unshift(as, bs)]),
  // 同一行内でしか閉じない以外括弧と同じ挙動
  surround(
    str('"'),
    precedence(2, recursion(Recursion.bracket, some(inline, '"', [['"', 2, false]]))),
    str('"'),
    true,
    ([as, bs = [], cs], context) =>
      context.linebreak === 0
        ? [push(unshift(as, bs), cs)]
        : (context.position -= 1, [unshift(as, bs)]),
    ([as, bs = []]) => [unshift(as, bs)],
    [2 | Backtrack.bracket]),
]));
