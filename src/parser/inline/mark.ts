import { MarkParser } from '../inline';
import { union, sequence, some, creator, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startTight, isEndTightNodes } from '../util';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';

export const mark: MarkParser = lazy(() => creator(surround(
  str('=='),
  startTight(some(union([
    some(inline, /^\s*==/),
    sequence([some(inline, '='), inline]),
  ]))),
  str('=='), false,
  ([as, bs, cs], rest) =>
    isEndTightNodes(bs)
      ? [[html('mark', defrag(bs))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
