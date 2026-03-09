import { MarkParser } from '../inline';
import { State, Recursion, Command } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, state, constraint, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { identity, signature } from './extension/indexee';
import { tightStart, blankWith } from '../visibility';
import { unwrap, repeat } from '../util';
import { html, define, defrag } from 'typed-dom/dom';

export const mark: MarkParser = lazy(() => constraint(State.linkers & ~State.mark,
  precedence(0, state(State.mark, repeat('==', surround(
    '',
    recursion(Recursion.inline,
    tightStart(some(union([
      some(inline, blankWith('==')),
      open(some(inline, '='), inline),
    ])))),
    '==',
    false, [],
    ([, bs], { buffer }) => buffer.import(bs),
    ([, bs], { buffer }) => bs && buffer.import(bs).push(new Node(Command.Cancel)) && buffer),
    (nodes, { id }) => {
      const el = html('mark', defrag(unwrap(nodes)));
      define(el, { id: identity('mark', id, signature(el)) });
      return el.id
        ? new List([new Node(el), new Node(html('a', { href: `#${el.id}` }))])
        : new List([new Node(el)]);
    })))));
