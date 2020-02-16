import { InsertionParser, inline } from '../inline';
import { union, some, creator, open, close, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { str } from '../source';
import { html } from 'typed-dom';
import { shift, pop } from 'spica/array';

export const insertion: InsertionParser = lazy(() => creator(fmap(open(
  str('++'), close(
  union([some(inline, '++')]),
  str('++'),
  (ns, rest) => [[defrag(html('ins', pop(ns)[0]))], rest],
  (ns, rest) => [ns, rest])),
  ns => 'id' in ns[1] && ns[1].tagName === 'INS' ? shift(ns)[1] : ns)));
