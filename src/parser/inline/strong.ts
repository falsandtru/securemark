import { StrongParser } from '../inline';
import { Recursion } from '../context';
import { union, some, recursion, precedence, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { emstrong } from './emstrong';
import { str } from '../source';
import { tightStart, blankWith } from '../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const strong: StrongParser = lazy(() => surround(
  str('**', '*'),
  precedence(0, recursion(Recursion.inline,
  tightStart(some(union([
    some(inline, blankWith('**')),
    open(some(inline, '*'), union([
      emstrong,
      strong,
    ])),
  ]))))),
  str('**'), false,
  ([, bs]) => [[html('strong', defrag(bs))]],
  ([as, bs]) => [unshift(as, bs)]));
