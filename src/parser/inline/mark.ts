import { MarkParser } from '../inline';
import { union, some, creator, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startTight, isEndTight, trimEndBR } from '../util';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';

export const mark: MarkParser = lazy(() => creator(surround(
  str('=='),
  startTight(union([some(inline, '==')])),
  str('=='), false,
  ([as, bs, cs], rest) =>
    isEndTight(bs)
      ? [[html('mark', defrag(trimEndBR(bs)))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
