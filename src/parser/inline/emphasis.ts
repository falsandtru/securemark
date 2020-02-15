import { EmphasisParser, inline } from '../inline';
import { union, some, creator, open, close, lazy, fmap } from '../../combinator';
import { strong } from './strong';
import { str } from '../source';
import { defrag, startTight } from '../util';
import { html } from 'typed-dom';

export const emphasis: EmphasisParser = lazy(() => creator(fmap(open(
  str('*'), close(
  startTight(some(union([strong, some(inline, '*')]))),
  str('*'), true, void 0,
  (ns, rest) => [[defrag(html('em', ns.pop()! && ns))], rest],
  (ns, rest) => [ns, rest])),
  ns => 'id' in ns[1] && ns[1].nodeName === 'EM' ? ns.shift()! && ns : ns)));
