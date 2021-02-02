import { InsertionParser } from '../inline';
import { union, some, creator, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';

export const insertion: InsertionParser = lazy(() => creator(surround(
  str('++'),
  union([some(inline, '++')]),
  str('++'), false,
  ([, bs], rest) => [[html('ins', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
