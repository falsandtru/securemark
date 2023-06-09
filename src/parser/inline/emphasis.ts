import { EmphasisParser } from '../inline';
import { union, some, syntax, creation, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { emstrong } from './emstrong';
import { strong } from './strong';
import { str } from '../source';
import { Syntax, State } from '../context';
import { startTight, blankWith } from '../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const emphasis: EmphasisParser = lazy(() => creation(surround(
  str('*', '*'),
  syntax(Syntax.none, 1, State.none,
  startTight(some(union([
    strong,
    some(inline, blankWith('*'), [[/^\\?\n/, 9]]),
    open(some(inline, '*', [[/^\\?\n/, 9]]), union([
      emstrong,
      strong,
      emphasis,
    ])),
  ])))),
  str('*'), false,
  ([, bs], rest) => [[html('em', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
