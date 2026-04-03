import { DeletionParser } from '../inline';
import { Recursion, Command } from '../context';
import { List, Node } from '../../combinator/parser';
import { union, some, precedence, backtrack, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { repeat } from '../repeat';
import { blankWith } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const deletion: DeletionParser = lazy(() =>
  repeat('~~', '', '~~', Recursion.inline, precedence(0, backtrack(surround(
    '',
    some(union([
      some(inline, blankWith('\n', '~~')),
      open('\n', some(inline, '~'), true),
    ])),
    '~~',
    false, [],
    ([, bs], _, output) => output.import(bs),
    ([, bs], _, output) => bs && output.import(bs.push(new Node(Command.Cancel)))))),
    nodes => new List([new Node(html('del', defrag(unwrap(nodes))))])));
