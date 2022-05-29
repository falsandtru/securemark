import { MarkdownParser } from '../../../markdown';
import { EmStrongParser, EmphasisParser, StrongParser } from '../inline';
import { Result, IntermediateParser } from '../../combinator/data/parser';
import { union, some, creator, surround, open, lazy, bind } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { emphasis } from './emphasis';
import { str } from '../source';
import { startTight, blank } from '../util';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

const substrong: IntermediateParser<StrongParser> = lazy(() => some(union([
  some(inline, blank('**')),
  open(some(inline, '*'), union([
    emstrong,
    strong,
  ])),
])));
const subemphasis: IntermediateParser<EmphasisParser> = lazy(() => some(union([
  strong,
  some(inline, blank('*')),
  open(some(inline, '*'), union([
    emstrong,
    strong,
    emphasis,
  ])),
])));

export const emstrong: EmStrongParser = lazy(() => creator(surround(
  str('***'),
  startTight(some(union([
    some(inline, blank('*')),
    open(some(inline, '*'), inline),
  ]))),
  str(/^\*{1,3}/), false,
  ([, bs, cs], rest, context): Result<HTMLElement | string, MarkdownParser.Context> => {
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
          (rest, context) ?? [['*', html('strong', defrag(bs))], rest];
      case '*':
        return bind<StrongParser>(
          substrong,
          (ds, rest) =>
            rest.slice(0, 2) === '**'
              ? [[html('strong', unshift([html('em', defrag(bs))], defrag(ds)))], rest.slice(2)]
              : [unshift(['**', html('em', defrag(bs))], ds), rest])
          (rest, context) ?? [['**', html('em', defrag(bs))], rest];
    }
    assert(false);
  },
  ([as, bs], rest) => [unshift(as, bs), rest])));
