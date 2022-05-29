import { MarkParser } from '../inline';
import { union, some, creator, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startTight, blankWith } from '../util';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

export const mark: MarkParser = lazy(() => creator(surround(
  str('=='),
  startTight(some(union([
    some(inline, blankWith('==')),
    open(some(inline, '='), mark),
  ]))),
  str('=='), false,
  ([, bs], rest) => [[html('mark', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
