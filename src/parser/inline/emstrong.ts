import { EmStrongParser, inline } from '../inline';
import { union, some, creator, surround, lazy, bind } from '../../combinator';
import { startTight, isEndTight, trimEnd, defrag } from '../util';
import { str } from '../source';
import { html } from 'typed-dom';
import { unshift } from 'spica/array';

export const emstrong: EmStrongParser = lazy(() => creator(surround(
  str('***'),
  startTight(union([some(inline, '*')])),
  str(/^\*{1,3}/), false,
  ([as, bs, cs], rest, context) => {
    if (!isEndTight(bs)) return [unshift(as, bs), cs[0] + rest];
    switch (cs[0]) {
      case '*':
        return bind<EmStrongParser>(
          union([some(inline, '**')]),
          (ms, rest) =>
            rest.slice(0, 2) === '**' && isEndTight(ms)
              ? [[html('strong', unshift([html('em', defrag(trimEnd(bs)))], defrag(trimEnd(ms))))], rest.slice(2)]
              : [unshift(['**', html('em', defrag(trimEnd(bs)))], ms), rest])
          (rest, context) || [['**', html('em', defrag(trimEnd(bs)))], rest];
      case '**':
        return bind<EmStrongParser>(
          union([some(inline, '*')]),
          (ms, rest) =>
            rest.slice(0, 1) === '*' && isEndTight(ms)
              ? [[html('em', unshift([html('strong', defrag(trimEnd(bs)))], defrag(trimEnd(ms))))], rest.slice(1)]
              : [unshift(['*', html('strong', defrag(trimEnd(bs)))], ms), rest])
          (rest, context) || [['*', html('strong', defrag(trimEnd(bs)))], rest];
      case '***':
        return [[html('em', [html('strong', defrag(trimEnd(bs)))])], rest];
    }
    assert(false);
  },
  ([as, bs], rest) => [unshift(as, bs), rest])));
