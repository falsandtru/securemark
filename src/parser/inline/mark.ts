import { MarkParser } from '../inline';
import { State, Recursion, Command } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, precedence, state, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { identity, signature } from './extension/indexee';
import { repeat } from '../repeat';
import { beforeNonblank, afterNonblank } from '../visibility';
import { unwrap } from '../util';
import { html, define, defrag } from 'typed-dom/dom';

export const mark: MarkParser = lazy(() =>
  repeat('==', beforeNonblank, '==', Recursion.inline, precedence(0, surround(
    '',
    state(State.mark, some(union([inline]), '==', afterNonblank)),
    '==',
    false, [],
    ([, bs], { buffer }) => buffer.import(bs),
    ([, bs], { buffer }) => bs && buffer.import(bs).push(new Node(Command.Cancel)) && buffer)),
    (nodes, { id, state }, lead) => {
      const el = html('mark', defrag(unwrap(nodes)));
      if (state & State.linkers || lead >= 2) return new List([new Node(el)]);
      define(el, { id: identity('mark', id, signature(el.cloneNode(true))) });
      return el.id
        ? new List([new Node(el), new Node(html('a', { href: `#${el.id}` }))])
        : new List([new Node(el)]);
    }));
