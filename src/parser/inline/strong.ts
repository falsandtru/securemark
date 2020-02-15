import { StrongParser, inline } from '../inline';
import { union, some, creator, open, close, lazy, fmap } from '../../combinator';
import { defrag, startTight } from '../util';
import { emphasis } from './emphasis';
import { str } from '../source';
import { html } from 'typed-dom';
import { shift, pop } from 'spica/array';

export const strong: StrongParser = lazy(() => creator(fmap(open(
  str('**'), close(
  startTight(some(union([emphasis, some(inline, '*')]), '**')),
  str('**'), true, void 0,
  (ns, rest) => [[defrag(html('strong', pop(ns)[0]))], rest],
  (ns, rest) => [ns, rest])),
  ns => 'id' in ns[1] && ns[1].nodeName === 'STRONG' ? shift(ns)[1] : ns)));
