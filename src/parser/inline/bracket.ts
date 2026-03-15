import { BracketParser } from '../inline';
import { State, Recursion, Backtrack } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, surround, isBacktrack, setBacktrack, lazy } from '../../combinator';
import { inline } from '../inline';
import { textlink } from './link';
import { str } from '../source';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const indexA = /^[0-9A-Za-z]+(?:(?:[.-]|, )[0-9A-Za-z]+)*$/;
const indexF = new RegExp(indexA.source.replace(', ', '[，、]')
  .replace(/[09AZaz.]|\-(?!\w)/g, c => String.fromCodePoint(c.codePointAt(0)! + 0xFEE0)));

export const bracket: BracketParser = lazy(() => union([
  input => {
    const { context: { source, position } } = input;
    switch (source[position]) {
      case '(':
        return p1(input);
      case '（':
        return p2(input);
      case '[':
        return s1(input);
      case '［':
        return s2(input);
      case '{':
        return c1(input);
      case '｛':
        return c2(input);
      case '"':
        return d1(input);
    }
  }
])) as any;

const p1 = lazy(() => surround(
  str('('),
  precedence(1, recursion(Recursion.bracket, some(inline, ')', [[')', 1]]))),
  str(')'),
  true, [],
  ([as, bs = [], cs], { source, position, range, linebreak }) => {
    const str = linebreak === 0 ? source.slice(position - range + 1, position - 1) : '';
    return linebreak === 0 && indexA.test(str)
      ? new List([new Node(html('span', { class: 'paren' }, `(${str})`))])
      : new List([new Node(html('span', { class: 'bracket' }, defrag(unwrap(as.import(bs as List<Node<string>>).import(cs)))))]);
  },
  ([as, bs = new List()], context) => {
    const { source, position, range, linebreak } = context;
    const str = linebreak === 0 ? source.slice(position - range + 1, position) : '';
    return linebreak === 0 && indexA.test(str)
      ? new List([new Node(html('span', { class: 'paren' }, `(${str}`))])
      : new List([new Node(html('span', { class: 'bracket' }, defrag(unwrap(as.import(bs as List<Node<string>>)))))]);
  }));

const p2 = lazy(() => surround(
  str('（'),
  precedence(1, recursion(Recursion.bracket, some(inline, '）', [['）', 1]]))),
  str('）'),
  true, [],
  ([as, bs = [], cs], { source, position, range, linebreak }) => {
    const str = linebreak === 0 ? source.slice(position - range + 1, position - 1) : '';
    return linebreak === 0 && indexF.test(str)
      ? new List([new Node(html('span', { class: 'paren' }, `（${str}）`))])
      : new List([new Node(html('span', { class: 'bracket' }, defrag(unwrap(as.import(bs as List<Node<string>>).import(cs)))))]);
  },
  ([as, bs = new List()], context) => {
    const { source, position, range, linebreak } = context;
    const str = linebreak === 0 ? source.slice(position - range + 1, position) : '';
    return linebreak === 0 && indexF.test(str)
      ? new List([new Node(html('span', { class: 'paren' }, `（${str}`))])
      : new List([new Node(html('span', { class: 'bracket' }, defrag(unwrap(as.import(bs as List<Node<string>>)))))]);
  }));

const s1 = lazy(() => surround(
  str('['),
  precedence(1, recursion(Recursion.bracket, some(inline, ']', [[']', 1]]))),
  str(']'),
  true,
  [2 | Backtrack.common],
  ([as, bs = new List(), cs], context) => {
    const { source, position, range, linebreak } = context;
    const head = position - range;
    if (source[head + 1] === '[' && (linebreak !== 0 || source[position - 2] !== ']')) {
      setBacktrack(context, 2 | Backtrack.doublebracket, head);
    }
    if (context.state & State.link) {
      if (linebreak !== 0) {
        setBacktrack(context, 2 | Backtrack.link | Backtrack.ruby, head);
      }
      else if (source[position] !== '{') {
        setBacktrack(context, 2 | Backtrack.link, head);
      }
      else {
        if (!isBacktrack(context, 1 | Backtrack.link) && !textlink({ context })) {
          setBacktrack(context, 2 | Backtrack.link, head);
        }
        context.position = position;
        context.range = range;
      }
    }
    return as.import(bs as List<Node<string>>).import(cs);
  },
  ([as, bs = new List()]) => as.import(bs as List<Node<string>>)));

const s2 = lazy(() => surround(
  str('［'),
  precedence(1, recursion(Recursion.bracket, some(inline, '］', [['］', 1]]))),
  str('］'),
  true, [],
  undefined,
  ([as, bs = new List()]) => as.import(bs as List<Node<string>>)));

const c1 = lazy(() => surround(
  str('{'),
  precedence(1, recursion(Recursion.bracket, some(inline, '}', [['}', 1]]))),
  str('}'),
  true, [],
  undefined,
  ([as, bs = new List()]) => as.import(bs as List<Node<string>>)));

const c2 = lazy(() => surround(
  str('｛'),
  precedence(1, recursion(Recursion.bracket, some(inline, '｝', [['｝', 1]]))),
  str('｝'),
  true, [],
  undefined,
  ([as, bs = new List()]) => as.import(bs as List<Node<string>>)));

const d1 = lazy(() => surround(
  str('"'),
  // 改行の優先度を構文ごとに変える場合シグネチャの優先度対応が必要
  precedence(2, recursion(Recursion.bracket, some(inline, /["\n]/y, [['"', 2], ['\n', 3]]))),
  str('"'),
  true, [],
  undefined,
  ([as, bs = new List()]) => as.import(bs as List<Node<string>>)));
