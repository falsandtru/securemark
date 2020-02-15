import { EmphasisParser, inline } from '../inline';
import { union, some, creator, open, close, lazy, fmap } from '../../combinator';
import { defrag, startTight } from '../util';
import { strong } from './strong';
import { str } from '../source';
import { html } from 'typed-dom';
import { shift, pop } from 'spica/array';

export const emphasis: EmphasisParser = lazy(() => creator(fmap(open(
  str('*'), close(
  startTight(some(union([strong, some(inline, '*')]))),
  str('*'), true, void 0,
  (ns, rest) => [[defrag(html('em', pop(ns)[0]))], rest],
  (ns, rest) => [ns, rest])),
  ns => 'id' in ns[1] && ns[1].nodeName === 'EM' ? shift(ns)[1] : ns)));
