import { EmphasisParser, inline } from '../inline';
import { union, some, creator, surround, lazy } from '../../combinator';
import { strong } from './strong';
import { str } from '../source';
import { startTight, isEndTight, trimEndBR } from '../util';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom';

export const emphasis: EmphasisParser = lazy(() => creator(surround(
  str('*', '*'),
  startTight(some(union([strong, some(inline, '*')]))),
  str('*'), false,
  ([as, bs, cs], rest) =>
    isEndTight(bs)
      ? [[html('em', defrag(trimEndBR(bs)))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
