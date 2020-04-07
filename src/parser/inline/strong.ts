import { StrongParser, inline } from '../inline';
import { union, some, creator, surround, lazy } from '../../combinator';
import { startTight, isTight, trimEnd, defrag } from '../util';
import { emphasis } from './emphasis';
import { str } from '../source';
import { html } from 'typed-dom';
import { unshift } from 'spica/array';

export const strong: StrongParser = lazy(() => creator(surround(
  str('**'),
  startTight(some(union([emphasis, some(inline, '*')]), '**')),
  str('**'), false,
  ([as, bs, cs], rest) =>
    isTight(bs, 0, bs.length)
      ? [[html('strong', defrag(trimEnd(bs)))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
