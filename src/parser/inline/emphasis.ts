import { EmphasisParser } from '../inline';
import { union, some, precedence, creator, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { emstrong } from './emstrong';
import { strong } from './strong';
import { str } from '../source';
import { startTight, blankWith } from '../visibility';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

export const emphasis: EmphasisParser = lazy(() => creator(precedence(1, surround(
  str('*'),
  startTight(some(union([
    strong,
    some(inline, blankWith('*')),
    open(some(inline, '*'), union([
      emstrong,
      strong,
      emphasis,
    ])),
  ])), '*'),
  str('*'), false,
  ([, bs], rest) => [[html('em', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest]))));
