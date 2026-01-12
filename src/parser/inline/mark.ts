import { MarkParser } from '../inline';
import { State, Recursion } from '../context';
import { union, some, creation, precedence, constraint, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { identity, signature } from './extension/indexee';
import { str } from '../source';
import { startTight, blankWith } from '../visibility';
import { unshift } from 'spica/array';
import { html, define, defrag } from 'typed-dom/dom';

export const mark: MarkParser = lazy(() => constraint(State.mark, false, creation(1, Recursion.inline, surround(
  str('==', '='),
  precedence(0,
  startTight(some(union([
    some(inline, blankWith('==')),
    open(some(inline, '='), mark),
  ])))),
  str('=='), false,
  ([, bs], rest, { id }) => {
    const el = html('mark', defrag(bs));
    return [[
      define(el, { id: identity('mark', id, signature(el)) }),
      el.id && html('a', { href: `#${el.id}` }),
    ], rest];
  },
  ([as, bs], rest) => [unshift(as, bs), rest]))));
