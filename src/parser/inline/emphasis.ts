import { EmphasisParser, inline } from '../inline';
import { union, some, creator, open, close, lazy, fmap } from '../../combinator';
import { isVisible, defrag } from '../util';
import { strong } from './strong';
import { str } from '../source';
import { html } from 'typed-dom';
import { shift, pop } from 'spica/array';

export const emphasis: EmphasisParser = lazy(() => creator(fmap(open(
  str('*'), close(
  some(union([strong, some(inline, '*')])),
  str('*'),
  (ns, rest) =>
    isVisible(ns[0])
      ? [[defrag(html('em', pop(ns)[0]))], rest]
      : [ns, ns.pop()!.textContent! + rest],
  (ns, rest) => [ns, rest])),
  ns => 'id' in ns[1] && ns[1].tagName === 'EM' ? shift(ns)[1] : ns)));
