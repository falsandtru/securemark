import { BracketParser } from '../inline';
import { State, Recursion, Backtrack } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, surround, isBacktrack, setBacktrack, lazy } from '../../combinator';
import { inline } from '../inline';
import { textlink } from './link';
import { str } from '../source';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

const indexA = /^[0-9A-Za-z]+(?:(?:[.-]|, )[0-9A-Za-z]+)*$/;
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
  ([as, bs = new List(), cs], context) => {
    const { source, position, range } = context;
    const head = position - range;
    if (context.linebreak !== 0) {
      if (head > 0 && source[head - 1] === '(') {
        setBacktrack(context, 2 | Backtrack.doublebracket, head - 1);
      }
    }
    else if (source[position] !== ')' && source[head - 1] === '(') {
      setBacktrack(context, 2 | Backtrack.doublebracket, head - 1);
    }
    const str = source.slice(position - range + 1, position - 1);
    return indexA.test(str)
      ? new List([new Node(as.head!.value), new Node(str), new Node(cs.head!.value)])
      : new List([new Node(html('span', { class: 'paren' }, defrag(unwrap(as.import(bs as List<Node<string>>).import(cs)))))]);
  },
  ([as, bs = new List()]) => as.import(bs as List<Node<string>>)));

const p2 = lazy(() => surround(
  str('（'),
  precedence(1, recursion(Recursion.bracket, some(inline, '）', [['）', 1]]))),
  str('）'),
  true, [],
  ([as, bs = [], cs], { source, position, range }) => {
    const str = source.slice(position - range + 1, position - 1);
    return indexF.test(str)
      ? new List([new Node(as.head!.value), new Node(str), new Node(cs.head!.value)])
      : new List([new Node(html('span', { class: 'paren' }, defrag(unwrap(as.import(bs as List<Node<string>>).import(cs)))))]);
  },
  ([as, bs = new List()]) => as.import(bs as List<Node<string>>)));

const s1 = lazy(() => surround(
  str('['),
  precedence(1, recursion(Recursion.bracket, some(inline, ']', [[']', 1]]))),
  str(']'),
  true,
  [2 | Backtrack.common],
  ([as, bs = new List(), cs], context) => {
    const { source, position, range } = context;
    const head = position - range;
    if (context.linebreak !== 0) {
      if (head > 0 && source[head - 1] === '[') {
        setBacktrack(context, 2 | Backtrack.doublebracket, head - 1);
      }
    }
    else if (source[position] !== ']' && source[head - 1] === '[') {
      setBacktrack(context, 2 | Backtrack.doublebracket, head - 1);
    }
    if (context.state & State.link) {
      if (context.linebreak !== 0) {
        setBacktrack(context, 2 | Backtrack.link | Backtrack.ruby, head);
      }
      else if (source[position] !== '{') {
        setBacktrack(context, 2 | Backtrack.link, head);
      }
      else {
        context.state ^= State.link;
        const result = !isBacktrack(context, 1 | Backtrack.link)
          ? textlink({ context })
          : undefined;
        context.position = position;
        if (!result) {
          setBacktrack(context, 2 | Backtrack.link, head);
        }
        context.state ^= State.link;
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
