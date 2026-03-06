import { EmphasisParser } from '../inline';
import { Recursion } from '../context';
import { List, Data } from '../../combinator/data/parser';
import { union, some, recursion, precedence, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { str } from '../source';
import { tightStart, blankWith } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const emphasis: EmphasisParser = lazy(() => surround(
  str(/\*(?!\*)/y),
  precedence(0, recursion(Recursion.inline,
  tightStart(some(union([
    strong,
    some(inline, blankWith('*')),
    open(some(inline, '*'), inline),
  ]))))),
  str('*'),
  false, [],
  ([, bs]) => new List([new Data(html('em', defrag(unwrap(bs))))]),
  ([as, bs]) => bs && as.import(bs as List<Data<string>>)));
