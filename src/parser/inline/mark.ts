import { MarkParser } from '../inline';
import { State, Recursion, Command } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, state, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { identity, signature } from './extension/indexee';
import { tightStart, nonblankWith } from '../visibility';
import { unwrap, repeat } from '../util';
import { html, define, defrag } from 'typed-dom/dom';

export const mark: MarkParser = lazy(() =>
  precedence(0, recursion(Recursion.inline, repeat('==', surround(
    '',
    tightStart(state(State.mark, some(union([inline]), nonblankWith('==')))),
    '==',
    false, [],
    ([, bs], { buffer }) => buffer.import(bs),
    ([, bs], { buffer }) => bs && buffer.import(bs).push(new Node(Command.Cancel)) && buffer),
    (nodes, { id, state }) => {
      const el = html('mark', defrag(unwrap(nodes)));
      if (state & State.linkers) return new List([new Node(el)]);
      define(el, { id: identity('mark', id, signature(el)) });
      return el.id
        ? new List([new Node(el), new Node(html('a', { href: `#${el.id}` }))])
        : new List([new Node(el)]);
    }))));
