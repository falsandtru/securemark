import { MarkParser } from '../inline';
import { State, Recursion, Command } from '../context';
import { List, Node } from '../../combinator/parser';
import { union, some, precedence, state, backtrack, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { identity, signature } from './extension/indexee';
import { repeat } from '../repeat';
import { beforeNonblank, afterNonblank } from '../visibility';
import { unwrap } from '../util';
import { html, define, defrag } from 'typed-dom/dom';

export const mark: MarkParser = lazy(() =>
  repeat('==', beforeNonblank, '==', Recursion.inline, precedence(0, backtrack(surround(
    '',
    state(State.mark, some(union([inline]), '==', afterNonblank)),
    '==',
    false, [],
    ([, bs], _, output) => output.import(bs),
    ([, bs], _, output) => bs && output.import(bs.push(new Node(Command.Cancel)))))),
    (nodes, { id, state }, _, lead) => {
      const el = html('mark', defrag(unwrap(nodes)));
      if (state & State.linkers || lead >= 2) return new List([new Node(el)]);
      define(el, { id: identity('mark', id, signature(el.cloneNode(true))) });
      return el.id
        ? new List([new Node(el), new Node(html('a', { href: `#${el.id}` }))])
        : new List([new Node(el)]);
    }));
