import { StrongParser } from '../inline';
import { union, some, syntax, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { Syntax, State } from '../context';
import { startTight, blankWith } from '../visibility';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

export const strong: StrongParser = lazy(() => surround(
  str('*', '*'),
  syntax(Syntax.none, 1, 1, State.none,
  startTight(some(union([
    some(inline, blankWith('*')),
    open(some(inline, '*'), strong),
  ])))),
  str('*'), false,
  ([, bs], rest) => [[html('strong', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest]));
