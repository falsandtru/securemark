import { MarkParser } from '../inline';
import { State, Recursion, Command } from '../context';
import { union, some, recursion, precedence, state, constraint, validate, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { identity, signature } from './extension/indexee';
import { tightStart, blankWith } from '../visibility';
import { repeat } from '../util';
import { push } from 'spica/array';
import { html, define, defrag } from 'typed-dom/dom';

export const mark: MarkParser = lazy(() => constraint(State.linkers & ~State.mark, validate('==',
  precedence(0, state(State.mark, repeat('==', surround(
    '',
    recursion(Recursion.inline,
    tightStart(some(union([
      some(inline, blankWith('==')),
      open(some(inline, '='), mark),
    ])))),
    '==', false,
    ([, bs]) => [bs],
    ([, bs]) => bs && [push(bs, [Command.Cancel])]),
    (nodes, { id }) => {
      const el = html('mark', defrag(nodes));
      define(el, { id: identity('mark', id, signature(el)) });
      return el.id
        ? [el, html('a', { href: `#${el.id}` })]
        : [el];
    }))))));
