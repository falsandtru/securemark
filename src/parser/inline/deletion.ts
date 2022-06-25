import { DeletionParser } from '../inline';
import { union, some, syntax, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { Rule } from '../context';
import { blankWith } from '../visibility';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

export const deletion: DeletionParser = lazy(() => syntax(Rule.none, 1, surround(
  str('~~'),
  some(union([
    some(inline, blankWith('\n', '~~')),
    open('\n', some(inline, '~'), true),
  ])),
  str('~~'), false,
  ([, bs], rest) => [[html('del', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
