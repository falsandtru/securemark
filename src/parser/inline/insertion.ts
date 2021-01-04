import { InsertionParser, inline } from '../inline';
import { union, some, creator, surround, lazy } from '../../combinator';
import { defrag } from '../util';
import { str } from '../source';
import { unshift } from 'spica/array';
import { html } from 'typed-dom';

export const insertion: InsertionParser = lazy(() => creator(surround(
  str('++'),
  union([some(inline, '++')]),
  str('++'), false,
  ([, bs], rest) => [[html('ins', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
