import { StrongParser } from '../inline';
import { union, some, syntax, creation, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { emstrong } from './emstrong';
import { str } from '../source';
import { Syntax, State } from '../context';
import { startTight, blankWith } from '../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const strong: StrongParser = lazy(() => creation(surround(
  str('**', '*'),
  syntax(Syntax.none, 1, State.none,
  startTight(some(union([
    some(inline, blankWith('**'), [[/^\\?\n/, 9]]),
    open(some(inline, '*', [[/^\\?\n/, 9]]), union([
      emstrong,
      strong,
    ])),
  ])))),
  str('**'), false,
  ([, bs], rest) => [[html('strong', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
