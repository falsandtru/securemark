import { StrongParser } from '../inline';
import { Recursion } from '../context';
import { union, some, creation, precedence, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { emstrong } from './emstrong';
import { str } from '../source';
import { tightStart, blankWith } from '../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const strong: StrongParser = lazy(() => creation(1, Recursion.inline, surround(
  str('**', '*'),
  precedence(0,
  tightStart(some(union([
    some(inline, blankWith('**')),
    open(some(inline, '*'), union([
      emstrong,
      strong,
    ])),
  ])))),
  str('**'), false,
  ([, bs], rest) => [[html('strong', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
