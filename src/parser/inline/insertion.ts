import { InsertionParser } from '../inline';
import { Recursion, Command } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, precedence, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { repeat } from '../repeat';
import { blankWith } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const insertion: InsertionParser = lazy(() =>
  repeat('++', '', '++', Recursion.inline, precedence(0, surround(
    '',
    some(union([
      some(inline, blankWith('\n', '++')),
      open('\n', some(inline, '+'), true),
    ])),
    '++',
    false, [],
    ([, bs], { buffer }) => buffer.import(bs),
    ([, bs], { buffer }) => bs && buffer.import(bs).push(new Node(Command.Cancel)) && buffer)),
    nodes => new List([new Node(html('ins', defrag(unwrap(nodes))))])));
