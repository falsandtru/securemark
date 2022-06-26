import { InsertionParser } from '../inline';
import { union, some, syntax, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { Syntax } from '../context';
import { blankWith } from '../visibility';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

export const insertion: InsertionParser = lazy(() => surround(
  str('++'),
  syntax(Syntax.none, 1, 1,
  some(union([
    some(inline, blankWith('\n', '++')),
    open('\n', some(inline, '+'), true),
  ]))),
  str('++'), false,
  ([, bs], rest) => [[html('ins', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest]));
