import { EmphasisParser } from '../inline';
import { union, some, syntax, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { Syntax, State } from '../context';
import { startTight, blankWith } from '../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const emphasis: EmphasisParser = lazy(() => surround(
  str('_', '_'),
  syntax(Syntax.none, 1, 1, State.none,
  startTight(some(union([
    some(inline, blankWith('_')),
    open(some(inline, '_'), emphasis),
  ])))),
  str('_'), false,
  ([, bs], rest) => [[html('em', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest]));
