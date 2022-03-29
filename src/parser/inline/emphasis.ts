import { EmphasisParser } from '../inline';
import { union, some, creator, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { str } from '../source';
import { startTight, isEndTightNodes, delimiter } from '../util';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';

export const emphasis: EmphasisParser = lazy(() => creator(surround(
  str('*'),
  startTight(some(union([
    strong,
    some(inline, delimiter(/\*/)),
    open(some(inline, '*'), inline),
  ])), '*'),
  str('*'), false,
  ([as, bs, cs], rest) =>
    isEndTightNodes(bs)
      ? [[html('em', defrag(bs))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
