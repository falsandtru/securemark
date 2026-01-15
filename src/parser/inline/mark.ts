import { MarkParser } from '../inline';
import { State, Recursion, Command } from '../context';
import { union, some, creation, precedence, constraint, validate, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { identity, signature } from './extension/indexee';
import { tightStart, blankWith } from '../visibility';
import { repeat } from '../util';
import { push } from 'spica/array';
import { html, define, defrag } from 'typed-dom/dom';

export const mark: MarkParser = lazy(() => constraint(State.mark, false, creation(1, Recursion.inline, validate('==',
  precedence(0, repeat('==', surround(
    '',
    tightStart(some(union([
      some(inline, blankWith('==')),
      open(some(inline, '='), mark),
    ]))),
    '==', false,
    ([, bs], rest) => [bs, rest],
    ([, bs], rest) => [push(bs, [Command.Escape]), rest]),
    (nodes, { id }) => {
      const el = html('mark', defrag(nodes));
      define(el, { id: identity('mark', id, signature(el)) });
      return el.id
        ? [el, el.id && html('a', { href: `#${el.id}` })]
        : [el];
    }))))));
