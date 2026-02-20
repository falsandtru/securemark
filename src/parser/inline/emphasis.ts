import { EmphasisParser } from '../inline';
import { Recursion } from '../context';
import { union, some, recursion, precedence, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { str } from '../source';
import { tightStart, blankWith } from '../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const emphasis: EmphasisParser = lazy(() => surround(
  str(/\*(?!\*)/y),
  precedence(0, recursion(Recursion.inline,
  tightStart(some(union([
    strong,
    some(inline, blankWith('*')),
    open(some(inline, '*'), inline),
  ]))))),
  str('*'), false,
  ([, bs]) => [[html('em', defrag(bs))]],
  ([as, bs]) => bs && [unshift(as, bs)]));
