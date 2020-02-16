import { StrongParser, inline } from '../inline';
import { union, some, creator, open, close, lazy, fmap } from '../../combinator';
import { isTight, defrag } from '../util';
import { emphasis } from './emphasis';
import { str } from '../source';
import { html } from 'typed-dom';
import { shift, pop } from 'spica/array';

export const strong: StrongParser = lazy(() => creator(fmap(open(
  str('**'), close(
  some(union([emphasis, some(inline, '*')]), '**'),
  str('**'),
  (ns, rest) =>
    isTight(ns, 0, -1)
      ? [[defrag(html('strong', pop(ns)[0]))], rest]
      : [ns, ns.pop()!.textContent! + rest],
  (ns, rest) => [ns, rest])),
  ns => 'id' in ns[1] && ns[1].tagName === 'STRONG' ? shift(ns)[1] : ns)));
