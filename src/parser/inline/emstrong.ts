import { EmStrongParser, EmphasisParser, StrongParser } from '../inline';
import { Result, IntermediateParser } from '../../combinator/data/parser';
import { union, syntax, some, surround, open, lazy, bind } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { emphasis } from './emphasis';
import { str } from '../source';
import { Syntax, State } from '../context';
import { startTight, blankWith } from '../visibility';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

const substrong: IntermediateParser<StrongParser> = lazy(() => some(union([
  some(inline, blankWith('**'), [[/^\\?\n/, 9]]),
  open(some(inline, '*', [[/^\\?\n/, 9]]), union([
    emstrong,
    strong,
  ])),
])));
const subemphasis: IntermediateParser<EmphasisParser> = lazy(() => some(union([
  strong,
  some(inline, blankWith('*'), [[/^\\?\n/, 9]]),
  open(some(inline, '*', [[/^\\?\n/, 9]]), union([
    emstrong,
    strong,
    emphasis,
  ])),
])));

export const emstrong: EmStrongParser = lazy(() => surround(
  str('***'),
  syntax(Syntax.none, 1, 1, State.none,
  startTight(some(union([
    some(inline, blankWith('*'), [[/^\\?\n/, 9]]),
    open(some(inline, '*', [[/^\\?\n/, 9]]), inline),
  ])))),
  str(/^\*{1,3}/), false,
  ([, bs, cs], rest, context): Result<HTMLElement | string, typeof context> => {
    assert(cs.length === 1);
    switch (cs[0]) {
      case '***':
        return [[html('em', [html('strong', defrag(bs))])], rest];
      case '**':
        return bind<EmphasisParser>(
          subemphasis,
          (ds, rest) =>
            rest.slice(0, 1) === '*'
              ? [[html('em', unshift([html('strong', defrag(bs))], defrag(ds)))], rest.slice(1)]
              : [unshift(['*', html('strong', defrag(bs))], ds), rest])
          ({ source: rest, context }) ?? [['*', html('strong', defrag(bs))], rest];
      case '*':
        return bind<StrongParser>(
          substrong,
          (ds, rest) =>
            rest.slice(0, 2) === '**'
              ? [[html('strong', unshift([html('em', defrag(bs))], defrag(ds)))], rest.slice(2)]
              : [unshift(['**', html('em', defrag(bs))], ds), rest])
          ({ source: rest, context }) ?? [['**', html('em', defrag(bs))], rest];
    }
    assert(false);
  },
  ([as, bs], rest) => [unshift(as, bs), rest]));
