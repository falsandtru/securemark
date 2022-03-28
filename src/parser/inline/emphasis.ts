import { EmphasisParser } from '../inline';
import { union, sequence, some, creator, surround, close, lazy } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { str } from '../source';
import { startTight, isEndTightNodes } from '../util';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';

export const emphasis: EmphasisParser = lazy(() => creator(surround(close(
  str('*'), /^(?!\*)/),
  startTight(some(union([
    strong,
    some(inline, /^\s*\*/),
    sequence([some(inline, '*'), inline]),
  ]))),
  str('*'), false,
  ([as, bs, cs], rest) =>
    isEndTightNodes(bs)
      ? [[html('em', defrag(bs))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
