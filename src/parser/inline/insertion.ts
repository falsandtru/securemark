import { InsertionParser } from '../inline';
import { Recursion } from '../context';
import { union, some, creation, precedence, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { blankWith } from '../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const insertion: InsertionParser = lazy(() => creation(1, Recursion.inline, surround(
  str('++', '+'),
  precedence(0,
  some(union([
    some(inline, blankWith('\n', '++')),
    open('\n', some(inline, '+'), true),
  ]))),
  str('++'), false,
  ([, bs], rest) => [[html('ins', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
