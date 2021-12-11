import { StrongParser } from '../inline';
import { union, some, creator, surround, close, lazy } from '../../combinator';
import { inline } from '../inline';
import { emphasis } from './emphasis';
import { str } from '../source';
import { startTight, isEndTightNodes } from '../util';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';

export const strong: StrongParser = lazy(() => creator(surround(close(
  str('**'), /^(?!\*)/),
  startTight(some(union([emphasis, some(inline, '*'), str('*')]), '**')),
  str('**'), false,
  ([as, bs, cs], rest) =>
    isEndTightNodes(bs)
      ? [[html('strong', defrag(bs))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
