import { MarkParser, inline } from '../inline';
import { union, some, creator, surround, lazy } from '../../combinator';
import { str } from '../source';
import { startTight, isEndTight, trimEndBR } from '../util';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom';

export const mark: MarkParser = lazy(() => creator(surround(
  str('=='),
  startTight(union([some(inline, '==')])),
  str('=='), false,
  ([as, bs, cs], rest) =>
    isEndTight(bs)
      ? [[html('mark', defrag(trimEndBR(bs)))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
