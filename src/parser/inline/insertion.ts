import { InsertionParser, inline } from '../inline';
import { union, some, creator, open, close, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { str } from '../source';
import { html } from 'typed-dom';

export const insertion: InsertionParser = lazy(() => creator(fmap(open(
  str('++'), close(
  union([some(inline, '++')]),
  str('++'), true, void 0,
  (ns, rest) => [[defrag(html('ins', ns.pop()! && ns))], rest],
  (ns, rest) => [ns, rest])),
  ns => 'id' in ns[1] && ns[1].nodeName === 'INS' ? ns.shift()! && ns : ns)));
