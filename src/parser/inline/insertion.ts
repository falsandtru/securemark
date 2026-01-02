import { InsertionParser } from '../inline';
import { union, some, syntax, creation, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { Syntax, State, Recursion } from '../context';
import { blankWith } from '../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const insertion: InsertionParser = lazy(() => creation(1, Recursion.inline, surround(
  str('++', '+'),
  syntax(Syntax.none, 1, State.none,
  some(union([
    some(inline, blankWith('\n', '++')),
    open('\n', some(inline, '+'), true),
  ]))),
  str('++'), false,
  ([, bs], rest) => [[html('ins', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
