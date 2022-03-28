import { MarkParser } from '../inline';
import { union, some, creator, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startTight, isEndTightNodes, delimiter } from '../util';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';

export const mark: MarkParser = lazy(() => creator(surround(
  str('=='),
  startTight(some(union([
    some(inline, delimiter('==')),
    open(some(inline, '='), inline),
  ]))),
  str('=='), false,
  ([as, bs, cs], rest) =>
    isEndTightNodes(bs)
      ? [[html('mark', defrag(bs))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
