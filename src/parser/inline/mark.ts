import { MarkParser, inline } from '../inline';
import { union, some, creator, surround, lazy } from '../../combinator';
import { startTight, isTight, trimEnd, defrag } from '../util';
import { str } from '../source';
import { html } from 'typed-dom';
import { unshift } from 'spica/array';

export const mark: MarkParser = lazy(() => creator(surround(
  str('=='),
  startTight(union([some(inline, '==')])),
  str('=='), false,
  ([as, bs, cs], rest) =>
    isTight(bs, 0, bs.length)
      ? [[html('mark', defrag(trimEnd(bs)))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
