import { DeletionParser } from '../inline';
import { union, some, creator, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { blank } from '../util';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

export const deletion: DeletionParser = lazy(() => creator(surround(
  str('~~'),
  some(union([
    some(inline, blank(/\n/, '~~')),
    open(/^\n/, some(inline, '~'), true),
  ])),
  str('~~'), false,
  ([, bs], rest) => [[html('del', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
