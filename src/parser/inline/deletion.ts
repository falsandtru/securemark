import { DeletionParser } from '../inline';
import { Recursion, Command } from '../context';
import { List, Data } from '../../combinator/data/parser';
import { union, some, recursion, precedence, validate, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { blankWith } from '../visibility';
import { unwrap, repeat } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const deletion: DeletionParser = lazy(() => validate('~~',
  precedence(0, repeat('~~', surround(
    '',
    recursion(Recursion.inline,
    some(union([
      some(inline, blankWith('\n', '~~')),
      open('\n', some(inline, '~'), true),
    ]))),
    '~~', false,
    ([, bs], { buffer }) => buffer!.import(bs),
    ([, bs], { buffer }) => bs && buffer!.import(bs).push(new Data(Command.Cancel)) && buffer!),
    nodes => new List([new Data(html('del', defrag(unwrap(nodes))))])))));
