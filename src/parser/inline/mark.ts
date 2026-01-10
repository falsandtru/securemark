import { MarkParser } from '../inline';
import { union, some, syntax, creation, constraint, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { identity, signature } from './extension/indexee';
import { str } from '../source';
import { startTight, blankWith } from '../visibility';
import { State, Recursion } from '../context';
import { unshift } from 'spica/array';
import { html, define, defrag } from 'typed-dom/dom';

export const mark: MarkParser = lazy(() => creation(1, Recursion.inline, surround(
  str('==', '='),
  constraint(State.mark, false,
  syntax(0, State.none,
  startTight(some(union([
    some(inline, blankWith('==')),
    open(some(inline, '='), mark),
  ]))))),
  str('=='), false,
  ([, bs], rest, { id }) => {
    const el = html('mark', defrag(bs));
    return [[
      define(el, { id: identity('mark', id, signature(el)) }),
      el.id && html('a', { href: `#${el.id}` }),
    ], rest];
  },
  ([as, bs], rest) => [unshift(as, bs), rest])));
