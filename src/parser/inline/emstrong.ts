import { EmStrongParser, EmphasisParser, StrongParser } from '../inline';
import { Recursion, Command } from '../context';
import { Result, IntermediateParser } from '../../combinator/data/parser';
import { union, some, recursion, precedence, validate, surround, open, lazy, bind } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { emphasis } from './emphasis';
import { str } from '../source';
import { tightStart, blankWith } from '../visibility';
import { repeat } from '../util';
import { html, defrag } from 'typed-dom/dom';
import { unshift, push } from 'spica/array';

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
    ([, bs, cs], context): Result<HTMLElement | string, typeof context> => {
      assert(cs.length === 1);
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
                return [[html('em', unshift([html('strong', defrag(bs))], defrag(ds))), Command.Separator]];
              }
              else {
                return [push(unshift(['*', html('strong', defrag(bs))], ds), [Command.Separator])];
              }
            })
            ({ context }) ?? [['*', html('strong', defrag(bs)), Command.Separator]];
        case '*':
          return bind<StrongParser>(
            substrong,
            ds => {
              const { source } = context;
              if (source.startsWith('**', context.position)) {
                context.position += 2;
                return [[html('strong', unshift([html('em', defrag(bs))], defrag(ds))), Command.Separator]];
              }
              else {
                return [push(unshift(['**', html('em', defrag(bs))], ds), [Command.Separator])];
              }
            })
            ({ context }) ?? [['**', html('em', defrag(bs)), Command.Separator]];
      }
      assert(false);
    },
    ([as, bs]) => bs && [push(unshift(as, bs), [Command.Cancel])]),
    // 3以上の`*`に対してemの適用を保証する
    nodes => [html('em', [html('strong', defrag(nodes))])],
    (acc, context, prefix, postfix, state) => {
      const nodes = [];
      let i = postfix;
      if (state) while (i > 0) {
        switch (i) {
          case 1:
            acc = [[html('em', acc.flat())]];
            i -= 1;
            break;
          case 2:
            acc = [[html('strong', acc.flat())]];
            i -= 2;
            break;
          default:
            acc = [[html('em', [html('strong', acc.flat())])]];
            i -= 3;
        }
      }
      if (prefix > postfix) {
        nodes.push('*'.repeat(prefix - postfix));
      }
      for (let i = 0; i < acc.length; ++i) {
        nodes.push(...acc[i]);
      }
      if (postfix > 0) {
        context.position += postfix;
      }
      return [nodes];
    }))));
