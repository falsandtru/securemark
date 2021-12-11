import { EmStrongParser } from '../inline';
import { union, some, creator, surround, lazy, bind } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startTight, isEndTightNodes } from '../util';
import { html, defrag } from 'typed-dom';
import { unshift } from 'spica/array';

export const emstrong: EmStrongParser = lazy(() => creator(surround(
  str('***'),
  startTight(union([some(inline, '*')])),
  str(/^\*{1,3}/), false,
  ([as, bs, cs], rest, context) => {
    if (!isEndTightNodes(bs)) return [unshift(as, bs), cs[0] + rest];
    switch (cs[0]) {
      case '*':
        return bind<EmStrongParser>(
          union([some(inline, '**')]),
          (ds, rest) =>
            rest.slice(0, 2) === '**' && isEndTightNodes(ds)
              ? [[html('strong', unshift([html('em', defrag(bs))], defrag(ds)))], rest.slice(2)]
              : [unshift(['**', html('em', defrag(bs))], ds), rest])
          (rest, context) ?? [['**', html('em', defrag(bs))], rest];
      case '**':
        return bind<EmStrongParser>(
          union([some(inline, '*')]),
          (ds, rest) =>
            rest.slice(0, 1) === '*' && isEndTightNodes(ds)
              ? [[html('em', unshift([html('strong', defrag(bs))], defrag(ds)))], rest.slice(1)]
              : [unshift(['*', html('strong', defrag(bs))], ds), rest])
          (rest, context) ?? [['*', html('strong', defrag(bs))], rest];
      case '***':
        return [[html('em', [html('strong', defrag(bs))])], rest];
    }
    assert(false);
  },
  ([as, bs], rest) => [unshift(as, bs), rest])));
