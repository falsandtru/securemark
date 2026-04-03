import { BracketParser, InlineParser } from '../inline';
import { Input, State, Recursion, Backtrack } from '../context';
import { List, Node, Result } from '../../combinator/parser';
import { union, some, recursion, precedence, surround, isBacktrack, setBacktrack, lazy } from '../../combinator';
import { inline } from '../inline';
import { textlink } from './link';
import { str } from '../source';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export function bracketname(input: Input, opener: number, closer: number): string {
  const { range, linebreak } = input;
  return range - opener - closer === 0 || linebreak === 0 && range - opener - closer <= 16
    ? 'paren'
    : 'bracket';
}

export const bracket: BracketParser = lazy(() => union([
  (input, output) => {
    const { source, position } = input;
    switch (source[position]) {
      case '(':
        return p1(input, output);
      case '（':
        return p2(input, output);
      case '[':
        return s1(input, output);
      case '［':
        return s2(input, output);
      case '{':
        return c1(input, output);
      case '｛':
        return c2(input, output);
      case '"':
        return d1(input, output);
    }
  }
]));

const p1 = lazy(() => surround<InlineParser>(
  str('('),
  precedence(1, recursion(Recursion.inline, some(inline, ')', [[')', 1]]))),
  str(')'),
  true, [],
  ([as, bs = new List(), cs], input, output) =>
    output.append(new Node(html('span',
      { class: bracketname(input, 1, 1) },
      defrag(unwrap(as.import(bs as List<Node<string>>).import(cs)))))),
  ([as, bs = new List()], input, output) =>
    output.append(new Node(html('span',
      { class: bracketname(input, 1, 0) },
      defrag(unwrap(as.import(bs as List<Node<string>>))))))));

const p2 = lazy(() => surround<InlineParser>(
  str('（'),
  precedence(1, recursion(Recursion.inline, some(inline, '）', [['）', 1]]))),
  str('）'),
  true, [],
  ([as, bs = new List(), cs], input, output) =>
    output.append(new Node(html('span',
      { class: bracketname(input, 1, 1) },
      defrag(unwrap(as.import(bs as List<Node<string>>).import(cs)))))),
  ([as, bs = new List()], input, output) =>
    output.append(new Node(html('span',
      { class: bracketname(input, 1, 0) },
      defrag(unwrap(as.import(bs as List<Node<string>>))))))));

const s1 = lazy(() => surround<InlineParser>(
  str('['),
  precedence(1, recursion(Recursion.inline, some(inline, ']', [[']', 1]]))),
  str(']'),
  true,
  [2 | Backtrack.common],
  ([as, bs = new List(), cs], input, output) => {
    output.import(as.import(bs as List<Node<string>>).import(cs));
    const { source, position, range, linebreak } = input;
    const head = position - range;
    if (source[head + 1] === '[' && (linebreak !== 0 || source[position - 2] !== ']')) {
      setBacktrack(input, 2 | Backtrack.doublebracket, head);
    }
    if (input.state & State.link) {
      if (linebreak !== 0) {
        setBacktrack(input, 2 | Backtrack.link | Backtrack.ruby, head);
      }
      else if (source[position] !== '{') {
        setBacktrack(input, 2 | Backtrack.link, head);
      }
      else {
        if (!isBacktrack(input, 1 | Backtrack.link)) {
          input.memory = {
            position,
            range,
            head,
          };
          return cont;
        }
        input.position = position;
        input.range = range;
      }
    }
    return output.context;
  },
  ([as, bs = new List()], _, output) => output.import(as.import(bs as List<Node<string>>))));

interface Memory {
  readonly position: number;
  readonly range: number;
  readonly head: number;
}
const cont: Result<HTMLElement | string, Input<Memory>> = [
  (_, output) => {
    output.push();
    return output.context;
  },
  lazy(() => textlink),
  (input, output) => {
    const { memory: { position, range, head } } = input;
    if (output.state) {
      setBacktrack(input, 2 | Backtrack.link, head);
    }
    input.position = position;
    input.range = range;
    output.pop();
    return output.context;
  },
];

const s2 = lazy(() => surround<InlineParser>(
  str('［'),
  precedence(1, recursion(Recursion.inline, some(inline, '］', [['］', 1]]))),
  str('］'),
  true, [],
  undefined,
  ([as, bs = new List()], _, output) => output.import(as.import(bs as List<Node<string>>))));

const c1 = lazy(() => surround<InlineParser>(
  str('{'),
  precedence(1, recursion(Recursion.inline, some(inline, '}', [['}', 1]]))),
  str('}'),
  true, [],
  undefined,
  ([as, bs = new List()], _, output) => output.import(as.import(bs as List<Node<string>>))));

const c2 = lazy(() => surround<InlineParser>(
  str('｛'),
  precedence(1, recursion(Recursion.inline, some(inline, '｝', [['｝', 1]]))),
  str('｝'),
  true, [],
  undefined,
  ([as, bs = new List()], _, output) => output.import(as.import(bs as List<Node<string>>))));

const d1 = lazy(() => surround<InlineParser>(
  str('"'),
  // 改行の優先度を構文ごとに変える場合シグネチャの優先度対応が必要
  precedence(2, recursion(Recursion.inline, some(inline, /["\n]/y, [['"', 2], ['\n', 3]]))),
  str('"'),
  true, [],
  undefined,
  ([as, bs = new List()], _, output) => output.import(as.import(bs as List<Node<string>>))));
