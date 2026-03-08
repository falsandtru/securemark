import { InsertionParser } from '../inline';
import { Recursion, Command } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { blankWith } from '../visibility';
import { unwrap, repeat } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const insertion: InsertionParser = lazy(() =>
  precedence(0, repeat('++', surround(
    '',
    recursion(Recursion.inline,
    some(union([
      some(inline, blankWith('\n', '++')),
      open('\n', some(inline, '+'), true),
    ]))),
    '++',
    false, [],
    ([, bs], { buffer }) => buffer!.import(bs),
    ([, bs], { buffer }) => bs && buffer!.import(bs).push(new Node(Command.Cancel)) && buffer!),
    nodes => new List([new Node(html('ins', defrag(unwrap(nodes))))]))));
