import { EmphasisParser, inline } from '../inline';
import { union, some, creator, surround, lazy } from '../../combinator';
import { isTight, trimEnd, defrag } from '../util';
import { strong } from './strong';
import { char } from '../source';
import { html } from 'typed-dom';
import { unshift } from 'spica/array';

export const emphasis: EmphasisParser = lazy(() => creator(surround(
  char('*'),
  some(union([strong, some(inline, '*')])),
  char('*'), false,
  ([as, bs, cs], rest) =>
    isTight(bs, 0, bs.length)
      ? [[defrag(html('em', trimEnd(bs)))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
