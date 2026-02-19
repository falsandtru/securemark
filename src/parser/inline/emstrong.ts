import { EmStrongParser, EmphasisParser, StrongParser } from '../inline';
import { Recursion, Command } from '../context';
import { Result, Node, Context, IntermediateParser } from '../../combinator/data/parser';
import { union, some, recursion, precedence, validate, surround, open, lazy, bind } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { emphasis } from './emphasis';
import { str } from '../source';
import { tightStart, blankWith } from '../visibility';
import { repeat } from '../util';
import { unshift, push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

const substrong: IntermediateParser<StrongParser> = lazy(() => some(union([
  emphasis,
  some(inline, blankWith('*')),
  open(some(inline, '*'), union([
    emstrong,
    strong,
    emphasis,
  ])),
])));
const subemphasis: IntermediateParser<EmphasisParser> = lazy(() => some(union([
  strong,
  some(inline, blankWith('*')),
  open(some(inline, '*'), union([
    emstrong,
    strong,
    emphasis,
  ])),
])));

// 開閉が明示的でない構文は開閉の不明確な記号による再帰的適用を行わず
// 可能な限り早く閉じるよう解析しなければならない。
// このため終端記号の後ろを見て終端を中止し同じ構文を再帰的に適用してはならない。
export const emstrong: EmStrongParser = lazy(() => validate('***',
  precedence(0, repeat('***', surround(
    '',
    recursion(Recursion.inline,
    tightStart(some(union([
      some(inline, blankWith('*')),
      open(some(inline, '*'), union([
        emstrong,
        strong,
        emphasis,
      ])),
    ])))),
    str(/^\*{1,3}/), false,
    ([, bs, cs], context): Result<Node<EmStrongParser>, Context<EmStrongParser>> => {
      assert(cs.length === 1);
      const { buffer } = context;
      switch (cs[0]) {
        case '***':
          return [bs];
        case '**':
          return bind<EmphasisParser>(
            subemphasis,
            ds => {
              const { source } = context;
              if (source.startsWith('*', context.position)) {
                context.position += 1;
                return [[html('em', push(push(buffer!, [html('strong', defrag(bs))]), defrag(ds))), Command.Separator]];
              }
              else {
                return [prepend('*', push(push(push(buffer!, [html('strong', defrag(bs))]), defrag(ds)), [Command.Separator]))];
              }
            })
            ({ context }) ?? [prepend('*', push(push(buffer!, [html('strong', defrag(bs))]), [Command.Separator]))];
        case '*':
          return bind<StrongParser>(
            substrong,
            ds => {
              const { source } = context;
              if (source.startsWith('**', context.position)) {
                context.position += 2;
                return [[html('strong', push(push(buffer!, [html('em', defrag(bs))]), defrag(ds))), Command.Separator]];
              }
              else {
                return [prepend('**', push(push(push(buffer!, [html('em', defrag(bs))]), defrag(ds)), [Command.Separator]))];
              }
            })
            ({ context }) ?? [prepend('**', push(push(buffer!, [html('em', defrag(bs))]), [Command.Separator]))];
      }
      assert(false);
    },
    ([, bs], { buffer }) => bs && [push(push(buffer!, bs), [Command.Cancel])]),
    // 3以上の`*`に対してemの適用を保証する
    nodes => [html('em', [html('strong', defrag(nodes))])],
    (nodes, context, prefix, postfix, state) => {
      context.position += postfix;
      assert(postfix < 3);
      if (state) {
        switch (postfix) {
          case 0:
            break;
          case 1:
            nodes = [html('em', defrag(nodes))];
            break;
          case 2:
            nodes = [html('strong', defrag(nodes))];
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
                  return [[html('em', push(nodes, defrag(ds)))]];
                }
                else {
                  return [prepend('*', push(nodes, defrag(ds)))];
                }
              })
              ({ context })?.[0] ?? prepend('*', nodes);
            prefix -= 1;
            break;
          case 2:
            nodes = bind<StrongParser>(
              substrong,
              ds => {
                const { source } = context;
                if (source.startsWith('**', context.position)) {
                  context.position += 2;
                  return [[html('strong', push(nodes, defrag(ds)))]];
                }
                else {
                  return [prepend('**', push(nodes, defrag(ds)))];
                }
              })
              ({ context })?.[0] ?? prepend('**', nodes);
            prefix -= 2;
            break;
        }
      }
      if (prefix > postfix) {
        nodes = push(['*'.repeat(prefix - postfix)], nodes);
      }
      return [nodes];
    }))));

function prepend<N>(prefix: string, nodes: N[]): N[] {
  if (typeof nodes[0] === 'string') {
    nodes[0] = prefix + nodes[0] as N;
  }
  else {
    unshift([prefix], nodes);
  }
  return nodes;
}
