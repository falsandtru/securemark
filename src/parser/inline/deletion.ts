import { DeletionParser } from '../inline';
import { union, some, creator, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { trimNodeEndBR } from '../util';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';

export const deletion: DeletionParser = lazy(() => creator(surround(
  str('~~'),
  union([some(inline, '~~')]),
  str('~~'), false,
  ([, bs], rest) => [[html('del', defrag(trimNodeEndBR(bs)))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
