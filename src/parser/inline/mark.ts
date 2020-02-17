import { MarkParser, inline } from '../inline';
import { union, some, creator, surround, lazy } from '../../combinator';
import { isTight, defrag } from '../util';
import { str } from '../source';
import { html } from 'typed-dom';
import { unshift } from 'spica/array';

export const mark: MarkParser = lazy(() => creator(surround(
  str('=='),
  union([some(inline, '==')]),
  str('=='), false,
  ([as, bs = [], cs], rest) =>
    isTight(bs, 0, bs.length)
      ? [[defrag(html('mark', bs))], rest]
      : [unshift(as, bs), cs[0].data + rest],
  ([as, bs], rest) => [bs ? unshift(as, bs) : as, rest])));
