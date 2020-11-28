import { EmStrongParser, inline } from '../inline';
import { union, some, creator, bind, surround, lazy } from '../../combinator';
import { startTight, isEndTight, trimEnd, defrag } from '../util';
import { str } from '../source';
import { html } from 'typed-dom';
import { unshift, push } from 'spica/array';

export const emstrong: EmStrongParser = lazy(() => creator(surround(
  str('***'),
  startTight(union([some(inline, '*')])),
  str(/^\*{1,3}/), false,
  ([as, bs, cs], rest, context) => {
    if (!isEndTight(bs)) return [unshift(as, bs), cs[0] + rest];
    switch (cs[0]) {
      case '*':
        return bind<HTMLElement | string, EmStrongParser>(
          union([some(inline, '**')]),
          (ms, rest) =>
            rest.slice(0, 2) === '**'
              ? [[html('strong', unshift([html('em', defrag(trimEnd(bs)))], defrag(ms)))], rest.slice(2)]
              : [push(push(unshift(as, bs), cs), ms), rest])
          (rest, context) || [push(unshift(as, bs), cs), rest];
      case '**':
        return bind<HTMLElement | string, EmStrongParser>(
          union([some(inline, '*')]),
          (ms, rest) =>
            rest.slice(0, 1) === '*'
              ? [[html('em', unshift([html('strong', defrag(trimEnd(bs)))], defrag(ms)))], rest.slice(1)]
              : [push(push(unshift(as, bs), cs), ms), rest])
          (rest, context) || [push(unshift(as, bs), cs), rest];
      case '***':
        return [[html('em', [html('strong', defrag(trimEnd(bs)))])], rest];
    }
    assert(false);
  },
  ([as, bs], rest) => [unshift(as, bs), rest])));
