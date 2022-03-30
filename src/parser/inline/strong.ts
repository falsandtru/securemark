import { StrongParser } from '../inline';
import { union, some, creator, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startTight, delimiter } from '../util';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';

export const strong: StrongParser = lazy(() => creator(surround(
  str('**'),
  startTight(some(union([
    some(inline, delimiter(/\*\*/)),
    open(some(inline, '*'), inline),
  ])), '*'),
  str('**'), false,
  ([, bs], rest) => [[html('strong', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
