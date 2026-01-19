import { InsertionParser } from '../inline';
import { Recursion, Command } from '../context';
import { union, some, recursion, precedence, validate, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { blankWith } from '../visibility';
import { repeat } from '../util';
import { push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const insertion: InsertionParser = lazy(() => validate('++',
  precedence(0, repeat('++', surround(
    '',
    recursion(Recursion.inline,
    some(union([
      some(inline, blankWith('\n', '++')),
      open('\n', some(insertion, '+'), true),
    ]))),
    '++', false,
    ([, bs], rest) => [bs, rest],
    ([, bs], rest) => [push(bs, [Command.Escape]), rest]),
    nodes => [html('ins', defrag(nodes))]))));
