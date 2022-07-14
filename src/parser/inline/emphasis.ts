import { EmphasisParser } from '../inline';
import { union, some, syntax, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { emstrong } from './emstrong';
import { strong } from './strong';
import { str } from '../source';
import { Syntax, State } from '../context';
import { startTight, blankWith } from '../visibility';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

export const emphasis: EmphasisParser = lazy(() => surround(
  str('*'),
  syntax(Syntax.none, 1, 1, State.none,
  startTight(some(union([
    strong,
    some(inline, blankWith('*')),
    open(some(inline, '*'), union([
      emstrong,
      strong,
      emphasis,
    ])),
  ])), '*')),
  str('*'), false,
  ([, bs], rest) => [[html('em', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest]));
