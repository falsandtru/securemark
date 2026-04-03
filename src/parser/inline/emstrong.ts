import { EmStrongParser, EmphasisParser, StrongParser } from '../inline';
import { Recursion, Command } from '../context';
import { Parser, Output, List, Node } from '../../combinator/parser';
import { union, some, precedence, backtrack, surround, lazy, bind } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { emphasis } from './emphasis';
import { strs } from '../source';
import { repeat } from '../repeat';
import { beforeNonblank, afterNonblank } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

const substrong: Parser.IntermediateParser<StrongParser> = lazy(() => some(union([
  some(inline, '*', afterNonblank),
  emphasis,
])));
const subemphasis: Parser.IntermediateParser<EmphasisParser> = lazy(() => some(union([
  some(inline, '*', afterNonblank),
  strong,
])));

const c1 = lazy(() => union([
  bind(subemphasis, (ds, input, output) => {
    const { source } = input;
    const bs = output.pop();
    if (source.startsWith('*', input.position)) {
      input.position += 1;
      const buffer = new List<Node<HTMLElement | string>>().import(output.peek());
      buffer.push(new Node(html('strong', defrag(unwrap(bs)))));
      buffer.import(ds);
      return new List([
        new Node(html('em', defrag(unwrap(buffer)))),
        new Node(Command.Separator),
      ]);
    }
    else {
      const buffer = new List<Node<HTMLElement | string>>().import(output.peek());
      buffer.push(new Node(html('strong', defrag(unwrap(bs)))));
      buffer.import(ds);
      buffer.push(new Node(Command.Separator));
      return prepend('*', buffer);
    }
  }),
  (_, output: Output<string | HTMLElement>) =>
    output.import(prepend('*', new List([new Node(html('strong', defrag(unwrap(output.pop())))), new Node(Command.Separator)]))),
]));
const c2 = lazy(() => union([
  bind(substrong, (ds, input, output) => {
    const { source } = input;
    const bs = output.pop();
    if (source.startsWith('**', input.position)) {
      input.position += 2;
      const buffer = new List<Node<HTMLElement | string>>().import(output.peek());
      buffer.push(new Node(html('em', defrag(unwrap(bs)))));
      buffer.import(ds);
      return new List([
        new Node(html('strong', defrag(unwrap(buffer)))),
        new Node(Command.Separator),
      ]);
    }
    else {
      const buffer = new List<Node<HTMLElement | string>>().import(output.peek());
      buffer.push(new Node(html('em', defrag(unwrap(bs)))));
      buffer.import(ds);
      buffer.push(new Node(Command.Separator));
      return prepend('**', buffer);
    }
  }),
  (_, output: Output<string | HTMLElement>) =>
    output.import(prepend('**', new List([new Node(html('em', defrag(unwrap(output.pop())))), new Node(Command.Separator)]))),
]));
const t1 = lazy(() => union([
  bind(subemphasis, (ds, input, output) => {
    const { source } = input;
    if (source.startsWith('*', input.position)) {
      input.position += 1;
      return new List([new Node(html('em', defrag(unwrap(output.pop().import(ds)))))]);
    }
    else {
      return prepend('*', output.pop().import(ds));
    }
  }),
  (_, output: Output<string | HTMLElement>) =>
    output.import(prepend('*', output.pop())),
]));
const t2 = lazy(() => union([
  bind(substrong, (ds, input, output) => {
    const { source } = input;
    if (source.startsWith('**', input.position)) {
      input.position += 2;
      return new List([new Node(html('strong', defrag(unwrap(output.pop().import(ds)))))]);
    }
    else {
      return prepend('**', output.pop().import(ds));
    }
  }),
  (_, output: Output<string | HTMLElement>) =>
    output.import(prepend('**', output.pop())),
]));

// 開閉が明示的でない構文は開閉の不明確な記号による再帰的適用を行わず
// 可能な限り早く閉じるよう解析しなければならない。
// このため終端記号の後ろを見て終端を中止し同じ構文を再帰的に適用してはならない。
export const emstrong: EmStrongParser = lazy(() =>
  repeat('***', beforeNonblank, '***', Recursion.inline, precedence(0, backtrack(surround(
    '',
    some(union([some(inline, '*', afterNonblank)])),
    strs('*', 1, 3),
    false, [],
    ([, bs, cs], input, output) => {
      assert(cs.length === 1);
      switch (cs.head!.value) {
        case '***':
          return output.import(bs);
        case '**':
          output.push(bs);
          return c1(input, output);
        case '*':
          output.push(bs);
          return c2(input, output);
      }
      assert(false);
    },
    ([, bs], _, output) => bs && output.import(bs.push(new Node(Command.Cancel)))))),
    // 3以上の`*`に対してemの適用を保証する
    nodes => new List([new Node(html('em', [html('strong', defrag(unwrap(nodes)))]))]),
    (nodes, input, output, prefix, postfix, state) => {
      input.position += postfix;
      input.range += postfix;
      assert(postfix < 3);
      if (state) {
        switch (postfix) {
          case 0:
            break;
          case 1:
            nodes = new List([new Node(html('em', defrag(unwrap(nodes))))]);
            break;
          case 2:
            nodes = new List([new Node(html('strong', defrag(unwrap(nodes))))]);
            break;
          default:
            assert(false);
        }
        prefix -= postfix;
        postfix -= postfix;
        input.range += postfix;
        switch (prefix) {
          case 0:
            return output.import(nodes);
          case 1:
            output.push(nodes);
            return t1(input, output);
          case 2:
            output.push(nodes);
            return t2(input, output);
        }
      }
      if (prefix > postfix) {
        nodes = prepend('*'.repeat(prefix - postfix), nodes);
        prefix = 0;
        input.range += prefix - postfix;
      }
      return output.import(nodes);
    }));

function prepend(prefix: string, nodes: List<Node<string | HTMLElement>>): List<Node<string | HTMLElement>> {
  if (typeof nodes.head?.value === 'string') {
    nodes.head.value = prefix + nodes.head.value;
  }
  else {
    nodes.unshift(new Node(prefix));
  }
  return nodes;
}
