import { StrongParser, inline } from '../inline';
import { union, some, creator, surround, lazy } from '../../combinator';
import { startTight, isEndTight, trimEndBR, defrag } from '../util';
import { emphasis } from './emphasis';
import { str } from '../source';
import { unshift } from 'spica/array';
import { html } from 'typed-dom';

export const strong: StrongParser = lazy(() => creator(surround(
  str('**', '*'),
  startTight(some(union([emphasis, some(inline, '*'), str('*')]), '**')),
  str('**'), false,
  ([as, bs, cs], rest) =>
    isEndTight(bs)
      ? [[html('strong', defrag(trimEndBR(bs)))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
