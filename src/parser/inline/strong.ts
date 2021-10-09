import { StrongParser } from '../inline';
import { union, some, creator, surround, close, lazy } from '../../combinator';
import { inline } from '../inline';
import { emphasis } from './emphasis';
import { str } from '../source';
import { startTight, verifyEndTight, trimEndBR } from '../util';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';

export const strong: StrongParser = lazy(() => creator(surround(close(
  str('**'), /^(?!\*)/),
  startTight(some(union([emphasis, some(inline, '*'), str('*')]), '**')),
  str('**'), false,
  ([as, bs, cs], rest) =>
    verifyEndTight(bs)
      ? [[html('strong', defrag(trimEndBR(bs)))], rest]
      : [unshift(as, bs), cs[0] + rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
