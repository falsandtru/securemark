import { MarkParser, inline } from '../inline';
import { union, some, creator, open, close, lazy, fmap } from '../../combinator';
import { str } from '../source';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const mark: MarkParser = lazy(() => creator(fmap(open(
  str('=='), close(
  union([some(inline, '==')]),
  str('=='), true, void 0,
  (ns, rest) => [[html('mark', ns.pop()! && defrag(ns))], rest],
  (ns, rest) => [ns, rest])),
  ns => 'id' in ns[1] && ns[1].nodeName === 'MARK' ? ns.shift()! && ns : ns)));
