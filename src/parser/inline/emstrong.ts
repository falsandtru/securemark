import { EmStrongParser, inline } from '../inline';
import { union, some, creator, fmap, surround, lazy } from '../../combinator';
import { startTight, isEndTight, trimEnd, defrag } from '../util';
import { emphasis } from './emphasis';
import { strong } from './strong';
import { str } from '../source';
import { html } from 'typed-dom';
import { shift, unshift, push } from 'spica/array';

export const emstrong: EmStrongParser = lazy(() => creator(surround(
  str('***'),
  startTight(union([some(inline, '*')])),
  str(/^\*{1,3}/), false,
  ([as, bs, cs], rest, context) => {
    if (!isEndTight(bs)) return [unshift(as, bs), cs[0] + rest];
    switch (cs[0]) {
      case '*':
        return fmap(
          strong,
          ms =>
            typeof ms[0] === 'object'
              ? (ms[0].prepend(html('em', defrag(trimEnd(bs)))), ms)
              : push(unshift(as, bs), shift(ms)[1]))
          ('**' + rest, context) || [push(unshift(as, bs), cs), rest];
      case '**':
        return fmap(
          emphasis,
          ms =>
            typeof ms[0] === 'object'
              ? (ms[0].prepend(html('strong', defrag(trimEnd(bs)))), ms)
              : push(unshift(as, bs), shift(ms)[1]))
          ('*' + rest, context) || [push(unshift(as, bs), cs), rest];
      case '***':
        return [[html('em', [html('strong', defrag(trimEnd(bs)))])], rest];
    }
    assert(false);
  },
  ([as, bs], rest) => [unshift(as, bs), rest])));
