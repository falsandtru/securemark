import { StrongParser, inline } from '../inline';
import { union, some, creator, open, close, lazy, fmap } from '../../combinator';
import { emphasis } from './emphasis';
import { str } from '../source';
import { defrag, startTight } from '../util';
import { html } from 'typed-dom';

export const strong: StrongParser = lazy(() => creator(fmap(open(
  str('**'), close(
  startTight(some(union([emphasis, some(inline, '*')]), '**')),
  str('**'), true, void 0,
  (ns, rest) => [[html('strong', ns.pop()! && defrag(ns))], rest],
  (ns, rest) => [ns, rest])),
  ns => 'id' in ns[1] && ns[1].nodeName === 'STRONG' ? ns.shift()! && ns : ns)));
