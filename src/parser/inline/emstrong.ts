import { EmStrongParser, EmphasisParser, StrongParser } from '../inline';
import { Recursion, Command } from '../context';
import { Parser, Result, List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, surround, open, lazy, bind } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { emphasis } from './emphasis';
import { str } from '../source';
import { tightStart, blankWith } from '../visibility';
import { unwrap, repeat } from '../util';
import { html, defrag } from 'typed-dom/dom';

const substrong: Parser.IntermediateParser<StrongParser> = lazy(() => some(union([
  emphasis,
  some(inline, blankWith('*')),
  open(some(inline, '*'), inline),
])));
const subemphasis: Parser.IntermediateParser<EmphasisParser> = lazy(() => some(union([
  strong,
  some(inline, blankWith('*')),
  open(some(inline, '*'), inline),
])));

// 開閉が明示的でない構文は開閉の不明確な記号による再帰的適用を行わず
// 可能な限り早く閉じるよう解析しなければならない。
// このため終端記号の後ろを見て終端を中止し同じ構文を再帰的に適用してはならない。
export const emstrong: EmStrongParser = lazy(() =>
  precedence(0, recursion(Recursion.inline, repeat('***', surround(
    '',
    tightStart(some(union([
      some(inline, blankWith('*')),
      open(some(inline, '*'), inline),
    ]))),
    str(/\*{1,3}/y),
    false, [],
    ([, bs, cs], context): Result<Parser.Node<EmStrongParser>, Parser.Context<EmStrongParser>> => {
      assert(cs.length === 1);
      const { buffer } = context;
      switch (cs.head!.value) {
        case '***':
          return bs;
        case '**':
          return bind<EmphasisParser>(
            subemphasis,
            ds => {
              const { source } = context;
              if (source.startsWith('*', context.position)) {
                context.position += 1;
                buffer.push(new Node(html('strong', defrag(unwrap(bs)))));
                buffer.import(ds);
                return new List([new Node(html('em', defrag(unwrap(buffer)))), new Node(Command.Separator)]);
              }
              else {
                buffer.push(new Node(html('strong', defrag(unwrap(bs)))));
                buffer.import(ds);
                buffer.push(new Node(Command.Separator));
                return prepend('*', buffer);
              }
            })
            ({ context }) ?? prepend('*', buffer.import(new List([new Node(html('strong', defrag(unwrap(bs)))), new Node(Command.Separator)])));
        case '*':
          return bind<StrongParser>(
            substrong,
            ds => {
              const { source } = context;
              if (source.startsWith('**', context.position)) {
                context.position += 2;
                buffer.push(new Node(html('em', defrag(unwrap(bs)))));
                buffer.import(ds);
                return new List([new Node(html('strong', defrag(unwrap(buffer)))), new Node(Command.Separator)]);
              }
              else {
                buffer.push(new Node(html('em', defrag(unwrap(bs)))));
                buffer.import(ds);
                buffer.push(new Node(Command.Separator));
                return prepend('**', buffer);
              }
            })
            ({ context }) ?? prepend('**', buffer.import(new List([new Node(html('em', defrag(unwrap(bs)))), new Node(Command.Separator)])));
      }
      assert(false);
    },
    ([, bs], { buffer }) => bs && buffer.import(bs) && buffer.push(new Node(Command.Cancel)) && buffer),
    // 3以上の`*`に対してemの適用を保証する
    nodes => new List([new Node(html('em', [html('strong', defrag(unwrap(nodes)))]))]),
    (nodes, context, prefix, postfix, state) => {
      context.position += postfix;
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
        switch (prefix) {
          case 0:
            break;
          case 1:
            nodes = bind<EmphasisParser>(
              subemphasis,
              ds => {
                const { source } = context;
                if (source.startsWith('*', context.position)) {
                  context.position += 1;
                  return new List([new Node(html('em', defrag(unwrap(nodes.import(ds)))))]);
                }
                else {
                  return prepend('*', nodes.import(ds));
                }
              })
              ({ context }) ?? prepend('*', nodes);
            prefix -= 1;
            break;
          case 2:
            nodes = bind<StrongParser>(
              substrong,
              ds => {
                const { source } = context;
                if (source.startsWith('**', context.position)) {
                  context.position += 2;
                  return new List([new Node(html('strong', defrag(unwrap(nodes.import(ds)))))]);
                }
                else {
                  return prepend('**', nodes.import(ds));
                }
              })
              ({ context }) ?? prepend('**', nodes);
            prefix -= 2;
            break;
        }
      }
      if (prefix > postfix) {
        nodes = prepend('*'.repeat(prefix - postfix), nodes);
      }
      return nodes;
    }))));

function prepend<N>(prefix: string, nodes: List<Node<N>>): List<Node<N>> {
  if (typeof nodes.head?.value === 'string') {
    nodes.head.value = prefix + nodes.head.value as N;
  }
  else {
    nodes.unshift(new Node(prefix as N));
  }
  return nodes;
}
